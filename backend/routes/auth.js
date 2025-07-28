import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import process from "process";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { email, password, confirmPassword, role } = req.body;
    if (!email || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required." });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      email,
      password: hashedPassword,
      isVerified: true,
      role: role === "admin" ? "admin" : "user",
    });
    await user.save();
    res.status(201).json({ message: "Signup successful! You can now log in." });
  } catch (err) {
    res.status(500).json({ message: `Server error: ${err}` });
  }
});

// Login route (only for verified users)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials." });
    }
    if (!user.isVerified) {
      return res
        .status(400)
        .json({ message: "Please verify your account first." });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.json({ token, user: { email: user.email } });
  } catch (err) {
    res.status(500).json({ message: `Server error: ${err}` });
  }
});

export default router;
