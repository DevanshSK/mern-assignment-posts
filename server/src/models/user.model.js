import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";


const userSchema = new Schema({
    name: {
        type: String,
        required: [true, "User name is required"],
        lowercase: true,
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: [true, "Email must be unique"],
        lowercase: true,
        trim: true,
        index: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
}, {timestamps: true})

userSchema.pre("save", async function (next){
    if(!this.isModified("password")) return next();

    const salt = await bcrypt.genSalt(10);
    this.password =  await bcrypt.hash(this.password, salt);
    next();
})



userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

export const User = mongoose.model("User", userSchema);