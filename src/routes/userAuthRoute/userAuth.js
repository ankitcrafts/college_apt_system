import express from "express";
import { signupUser, loginUser } from "../../controllers/userAuthController/userAuth.js";

const router = express.Router();

// POST || Signup Route
router.post("/signup", signupUser);

// POST || Login Route
router.post("/login", loginUser);

export default router;
