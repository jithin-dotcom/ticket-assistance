
import express from "express";
import { getUser, login, logout, signup, updateUser } from "../controller/user";
import { authenticate } from "../middlewares/auth";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.post("/update-user",authenticate, updateUser);
router.get("/users", authenticate, getUser);

export default router;