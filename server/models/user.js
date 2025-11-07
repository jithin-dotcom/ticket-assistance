
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        require: true,
    },
    role: {
        type: String,
        default: "user",
        enum: ["user", "moderator", "admin"],
    },
    skills: [String],

},{timestamps: true})


export default mongoose.model("User", userSchema);