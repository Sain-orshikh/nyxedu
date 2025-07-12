import connectMongoDB from "../db/connectMongoDB.js";
import User from "../models/user.model.js";

export const getUserProfile = async (req,res) => {
    await connectMongoDB();
    const { email } = req.params;
    try{
        const user = await User.findOne({ email }).select("-password");
        if(!user) return res.status(400).json({error: "User not found"});
        res.status(200).json(user);
    }
    catch(error){
        console.log("Error in getUserProfile:",error.message);
        res.status(500).json({error: error.message});
    }
};

export const updateUser = async (req, res) => {
    await connectMongoDB();
    const { subjects } = req.body;
    const userId = req.user._id;
    try {
        let user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });
        if (Array.isArray(subjects)) {
            user.subjects = subjects;
        }
        user = await user.save();
        user.password = null;
        return res.status(200).json(user);
    } catch (error) {
        console.log("Error in updateUser: ", error.message);
        res.status(500).json({ error: error.message });
    }
};
