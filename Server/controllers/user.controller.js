import User from "../models/user.model.js";
import { errorHandler } from "../utils/errorHandler.js";
import bcryptjs from 'bcryptjs';

export const updateUser = async (req, res, next) => {
    if(req.user.id !== req.params.id ) return next(errorHandler(401, "Unauthorized to update account!!"));
    try {
        if(req.body.password){
            req.body.password = bcryptjs.hashSync(req.body.password, 10);
        }
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                avatar: req.body.avatar
            }
        }, {new: true});
        
        res.status(200).json({
            id: updatedUser._id,
            success: true,
            username: updatedUser.username,
            email: updatedUser.email,
            avatar: updatedUser.avatar
        })
    } catch (error) {
        next(error);
    }
}

export const deleteUser = async (req, res, next) => {
    if(req.user.id !== req.params.id) return next(errorHandler(401, "Unauthorized to delete user account"));

    try {
        await User.findByIdAndDelete(req.params.id);
        res.clearCookie('access_token').status(200).json({success: true, message: "User account is deleted"});
    } catch (error) {
        next(error);
    }
}