import connectMongoDB from "../db/connectMongoDB.js";
import User from "../models/user.model.js";

export const getUserProfile = async (req,res) => {
    await connectMongoDB();
    const {username} = req.params;
    try{
        const user = await User.findOne({username}).select("-password");
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
    const { username, email, subjects } = req.body;
    const userId = req.user._id;
    try {
        let user = await User.findById(userId);
        const usernameregex = await User.findOne({username});
        const emailregex = await User.findOne({email});
        if(usernameregex && usernameregex.username !== user.username) return res.status(400).json({error: "Username is already taken"});
        if(emailregex && emailregex.email !== user.email) return res.status(400).json({error: "Email is already taken"});
        if (!user) return res.status(404).json({ message: "User not found" });
        user.email = email || user.email;
        user.username = username || user.username;
        user.subjects = Array.isArray(subjects) ? subjects : user.subjects;
        user = await user.save();
        user.password = null;
        return res.status(200).json(user);
    } catch (error) {
        console.log("Error in updateUser: ", error.message);
        res.status(500).json({ error: error.message });
    }
};
