import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new Admin({ email, password: hashedPassword });
    await admin.save();
    res.status(201).json({ message: "Admin created successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: "Admin not found" });
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ message: "Wrong password" });
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, message: "Login successful" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
