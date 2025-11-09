import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { inngest } from "../inngest/client";


export const signup = async (req, res) => {
    const {email, password, skills=[]} = req.body;
    try {
        const hashedPassword = bcrypt.hash(password, 10);
        const user = await User.create({email, password: hashedPassword, skills});

        await inngest.send({
            name: "user/signup",
            data: {
                email,
            }
        });

        const token = jwt.sign({_id: user._id, role: user.role}, process.env.JWT_SECRET)
        res.status(200).json({user, token});

    } catch (error) {
        res.status(500).json({error: "Signup failed", details: error.message});
    }
}


export const login = async (req, res) => {
    const {email, password} = req.body;
    try {
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({error: "User not found"});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({error: "Invalid credentials"});
        }
        const token = jwt.sign({_id: user._id, role: user.role});
        res.status(200).json({user, token});
    } catch (error) {
        res.status(500).json({error: "Login error", details: error.message});
    }
}


export const logout = async (req, res) => {
    try {
        const token = req.header?.authorization.split(" ")[1];
        if(!token){
            return res.status(401).json({error: "Unauthorized"});
        }
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded)=>{
            if(err){
               return res.status(401).json({error: "Unauthorized"});
            }         
        })
        res.status(200).json({message: "Logout successful"});
    } catch (error) {
        
    }
}

export const updateUser = async (req, res) => {
    try {
        const {skills= [], role, email} = req.body;
        if(req.user?.role !== "admin"){
            return res.status(403).json({error: "Forbidden"});
        }
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({error: "User not found"});
        }
        await User.updateOne({email},{
            skills: skills.length > 0 ? skills : user.skills,
            role,
        })
        res.status(200).json({message: "User updated successfully"});
    } catch (error) {
        res.status(500).json({error: "Update failed", details: error.message});
    }
}


export const getUser = async (req, res) => {
    try {
        if(req.user.role !== "admin"){
            return res.status(403).json({error: "Forbidden"});
        }
        const users = await User.findOne({email}).select("-password");
        return res.status(200).json(users);
    } catch (error) {
        res.status(500).json({error: "Failed to get users", message: error.message});
    }
}