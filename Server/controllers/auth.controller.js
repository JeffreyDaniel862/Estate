import bcryptjs from 'bcryptjs';
import User from '../models/user.model.js';
import { errorHandler } from '../utils/errorHandler.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config()

export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    try {
        await newUser.save();
        res.status(201).json({ message: "User saved successfully" });
    } catch (error) {
        next(error);
    }
}

export const signin = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const validUser = await User.findOne({ email });
        if (!validUser) return next(errorHandler(404, 'User not found'));
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) return next(errorHandler(404, "Invalid email or password"));
        const userObject = { id: validUser._id, email: validUser.email, username: validUser.username, success: true, avatar: validUser.avatar };
        const token = jwt.sign({ id: validUser._id }, process.env.JWT_MAGIC);
        res.cookie('access_token', token, { httpOnly: true }).status(200).json(userObject);
    } catch (error) {
        next(error);
    }
}

export const googleAuth = async (req, res, next) => {
    const { username, email, photo } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user) {
            const userObject = { id: user._id, email: user.email, username: user.username, success: true, avatar: user.avatar }
            const token = jwt.sign({ id: user._id }, process.env.JWT_MAGIC);
            res.cookie("access_token", token, { httpOnly: true }).status(200).json(userObject);
        } else {
            const generatePassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatePassword, 10);
            const formattedUsername = username.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4);
            const newUser = new User({ username: formattedUsername, email, password: hashedPassword, avatar: photo });
            await newUser.save();
            const token = jwt.sign({ id: newUser._id }, process.env.JWT_MAGIC);
            const userObject = {id: newUser._id, email: newUser.email, username: newUser.username, success: true, avatar: newUser.avatar };
            res.cookie("access_token", token, { httpOnly: true }).status(200).json(userObject);
        }
    } catch (error) {
        next(error);
    }
}

export const signOut = (req, res, next) => {
    try {
        res.clearCookie("access_token").status(200).json({signedOut: true, message: "User signedOut successfully"});
    } catch (error) {
        next(error);
    }
}