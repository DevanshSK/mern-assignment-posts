
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const registerUser = async (req, res) => {
    try {
        const { email, password, name } = req.body;
        if (!email || !password || !name) {
            return res.status(409).json({
                success: false,
                message: "Email, Password and Name is required."
            });
        }

        const existingUser = await User.findOne({
            email: email,
        });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists with this email."
            });
        }

        const user = new User({
            email,
            password,
            name
        })

        await user.save();

        // Prepare JWT Payload
        const payload = {
            user: {
                id: user.id,
            }
        }

        jwt.sign(payload,
            process.env.JWT_SECRET,
            { expiresIn: "7 days" },
            (error, token) => {
                if (error) throw error;
                return res.status(201).json({
                    success: true,
                    message: "User Created Successfully",
                    data: {
                        accessToken: token
                    }
                })
            }
        );

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message || "Something went wrong"
        })
    }
}

const loginUser = async (req, res) => {
    try {
        // Data Validation
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(409).json({
                success: false,
                message: "Email and Password are required."
            });
        }

        const user = await User.findOne({ email });
        if(!user){
            return res.status(404).json({
                success: false,
                message: "User does not exists."
            });
        }

        const isMatch = await user.isPasswordCorrect(password);
        
        if(!isMatch){
            return res.status(401).json({
                success: false,
                message: "Invalid Credentials."
            });
        }
        // Prepare JWT Payload
        const payload = {
            user: {
                id: user.id,
            }
        }

        jwt.sign(payload,
            process.env.JWT_SECRET,
            { expiresIn: "30 days" },
            (error, token) => {
                if (error) throw error;
                return res.status(200).json({
                    success: true,
                    message: "User Logged in Successfully",
                    data: {
                        user,
                        accessToken: token
                    }
                })
            }
        );

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message || "Something went wrong"
        })
    }
}

const getUserInfo = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        return res.status(200).json({
            success: true,
            data: user
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message || "Something went wrong"
        })
    }
}

export { registerUser, loginUser, getUserInfo };