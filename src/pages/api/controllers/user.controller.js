export const fetchUserSubjects = async (req, res) => {
    await connectMongoDB();
    const userId = req.user._id;
    try {
        const user = await User.findById(userId).select("subjects");
        if (!user) return res.status(404).json({ message: "User not found" });
        return res.status(200).json({ subjects: user.subjects || [] });
    } catch (error) {
        console.log("Error in fetchUserSubjects: ", error.message);
        res.status(500).json({ error: error.message });
    }
};

export const fetchUserBookmarks = async (req, res) => {
    await connectMongoDB();
    const userId = req.user._id;
    try {
        const user = await User.findById(userId).select("bookmarks");
        if (!user) return res.status(404).json({ message: "User not found" });
        return res.status(200).json({ bookmarks: user.bookmarks || [] });
    } catch (error) {
        console.log("Error in fetchUserBookmarks: ", error.message);
        res.status(500).json({ error: error.message });
    }
};
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


export const addSubjects = async (req, res) => {
    await connectMongoDB();
    const { subjects } = req.body;
    const userId = req.user._id;
    try {
        let user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });
        if (Array.isArray(subjects)) {
            user.subjects = Array.from(new Set([...(user.subjects || []), ...subjects]));
        }
        user = await user.save();
        user.password = null;
        return res.status(200).json(user);
    } catch (error) {
        console.log("Error in addSubjects: ", error.message);
        res.status(500).json({ error: error.message });
    }
};

export const removeSubjects = async (req, res) => {
    await connectMongoDB();
    const { subjects } = req.body;
    const userId = req.user._id;
    try {
        let user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });
        if (Array.isArray(subjects)) {
            user.subjects = (user.subjects || []).filter(subj => !subjects.includes(subj));
        }
        user = await user.save();
        user.password = null;
        return res.status(200).json(user);
    } catch (error) {
        console.log("Error in removeSubjects: ", error.message);
        res.status(500).json({ error: error.message });
    }
};

export const bookmarkUnbookmark = async (req, res) => {
    await connectMongoDB();
    const { noteId } = req.body;
    const userId = req.user._id;
    try {
        let user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });
        if (!noteId) return res.status(400).json({ error: "noteId required" });
        const bookmarks = user.bookmarks || [];
        const idx = bookmarks.indexOf(noteId);
        if (idx > -1) {
            // Unbookmark
            bookmarks.splice(idx, 1);
        } else {
            // Bookmark
            bookmarks.push(noteId);
        }
        user.bookmarks = bookmarks;
        user = await user.save();
        user.password = null;
        return res.status(200).json(user);
    } catch (error) {
        console.log("Error in bookmarkUnbookmark: ", error.message);
        res.status(500).json({ error: error.message });
    }
};
