import connectMongoDB from "../db/connectMongoDB.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateToken.js";
import { Resend } from 'resend';
import crypto from 'crypto';

export const signup = async (req,res) => {
    await connectMongoDB();
    try {
        const { email, password } = req.body;
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid email format" });
        }

        // Username check removed

        const existingEmail = await User.findOne({ email });
        if ( existingEmail ) {
            return res.status(400).json({ error: "Email is already taken" });
        }

        if(password.length < 6){
            return res.status(400).json({ error: "Password must be atleast 6 character long" });
        }
        // hash password

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            email,
            password: hashedPassword,
            subjects: [],
            bookmarks: []
        })

        if (newUser){
            generateTokenAndSetCookie(newUser._id,res)
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                email: newUser.email,
                subjects: newUser.subjects,
                bookmarks: newUser.bookmarks
            })
        }   else{
            res.status(400).json({ error: "Invalid user data" });
        }

    }
    catch (error) {
        console.log("Error in signup controller", error.message);

        res.status(500).json({ error: "Internal server error" });
    }
};

export const login = async (req,res) => {
    await connectMongoDB();
    try {
        const { email, password } = req.body;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        let user = null;
        if (emailRegex.test(email)) {
            user = await User.findOne({ email });
        }
        if (!user) {
            return res.status(400).json({error: "Invalid user credentials1"});
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({error: "Invalid user credentials"});
        }
        generateTokenAndSetCookie(user._id, res);
        res.status(200).json({
            _id: user._id,
            email: user.email,
            subjects: user.subjects,
            bookmarks: user.bookmarks || []
        });
    }
    catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};


export const logout = async (req,res) => {
    await connectMongoDB();
    try {
        // Clear the cookie using Set-Cookie header
        res.setHeader('Set-Cookie', 'jwt=; Max-Age=0; Path=/; HttpOnly; SameSite=Strict;');
        res.status(200).json({message: "Logged out successfully"})
    }
    catch(error){
        console.log("Error in logout controller", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getMe = async (req,res) => {
    await connectMongoDB();
    try {
        const user = await User.findById(req.user._id).select("-password");
        res.status(200).json(user);
    }
    catch(error){
        console.log("Error in getMe controller", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const forgotPassword = async (req, res) => {
    await connectMongoDB();
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { email } = req.body;
    
    if (!email) return res.status(400).json({ error: 'Email is required' });
    
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    // Generate 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const otpExpire = Date.now() + 1000 * 60 * 10; // 10 minutes
    
    user.resetPasswordOTP = otp;
    user.resetPasswordOTPExpire = otpExpire;
    await user.save();

    try {
        await resend.emails.send({
            from: 'noreply@nyxedu.org', // Use your verified domain
            to: email,
            subject: 'Your Password Reset Code - NyxEdu',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #1e40af; margin: 0;">NyxEdu</h1>
                    </div>
                    <h2 style="color: #333; text-align: center;">Password Reset Code</h2>
                    <p style="color: #666; font-size: 16px;">Hello,</p>
                    <p style="color: #666; font-size: 16px;">You requested to reset your password. Please use the verification code below:</p>
                    <div style="background: #f8fafc; border: 2px solid #e5e7eb; padding: 30px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; margin: 30px 0; border-radius: 8px; color: #1e40af;">
                        ${otp}
                    </div>
                    <p style="color: #666; font-size: 14px; text-align: center;"><strong>This code will expire in 10 minutes.</strong></p>
                    <p style="color: #666; font-size: 14px;">If you didn't request this password reset, please ignore this email. Your account remains secure.</p>
                    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
                    <p style="color: #999; font-size: 12px; text-align: center;">This is an automated message from NyxEdu. Please do not reply to this email.</p>
                </div>
            `
        });
        res.status(200).json({ message: 'Reset code sent to your email' });
    } catch (error) {
        console.log('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send email' });
    }
};

export const verifyResetOTP = async (req, res) => {
    await connectMongoDB();
    const { email, otp } = req.body;
    
    if (!email || !otp) {
        return res.status(400).json({ error: 'Email and OTP are required' });
    }
    
    const user = await User.findOne({ 
        email, 
        resetPasswordOTP: otp 
    });
    
    if (!user || !user.resetPasswordOTPExpire || user.resetPasswordOTPExpire < Date.now()) {
        return res.status(400).json({ error: 'Invalid or expired OTP' });
    }
    
    res.status(200).json({ message: 'OTP verified successfully' });
};

export const resetPasswordWithOTP = async (req, res) => {
    await connectMongoDB();
    const { email, otp, newPassword } = req.body;
    
    if (!email || !otp || !newPassword) {
        return res.status(400).json({ error: 'Email, OTP, and new password are required' });
    }
    
    const user = await User.findOne({ 
        email, 
        resetPasswordOTP: otp 
    });
    
    if (!user || !user.resetPasswordOTPExpire || user.resetPasswordOTPExpire < Date.now()) {
        return res.status(400).json({ error: 'Invalid or expired OTP' });
    }
    
    if (newPassword.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }
    
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetPasswordOTP = undefined;
    user.resetPasswordOTPExpire = undefined;
    await user.save();
    
    res.status(200).json({ message: 'Password has been reset successfully' });
};

export const resetPassword = async (req, res) => {
    await connectMongoDB();
    const { email, token, newPassword } = req.body;
    if (!email || !token || !newPassword) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    const user = await User.findOne({ email, resetPasswordToken: token });
    if (!user || !user.resetPasswordExpire || user.resetPasswordExpire < Date.now()) {
        return res.status(400).json({ error: 'Invalid or expired token' });
    }
    if (newPassword.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    res.status(200).json({ message: 'Password has been reset successfully' });
};
