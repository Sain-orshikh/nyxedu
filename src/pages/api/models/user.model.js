import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
        minLength: 6,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    subjects: {
        type: [String],
        default: [],
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
},{timestamps: true});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
