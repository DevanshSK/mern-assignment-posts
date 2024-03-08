import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const verifyJwt = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "")
        if(!token){
            return res.status(401).json({
                success: false,
                message: "Unauthorized Request."
            });
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decodedToken?.user?.id).select("-password");
        console.log(user)
        if(!user){
            return res.status(401).json({
                success: false,
                message: "Invalid Access Token."
            });
        }

        req.user = user;
        next();

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message || "Something went wrong"
        })
    }
}

export default verifyJwt;