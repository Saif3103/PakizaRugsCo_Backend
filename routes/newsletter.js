import express from "express";
import Newsletter from "../models/Newsletter.js";
import protect from "../middleware/auth.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const existing = await Newsletter.findOne({ email: req.body.email });
    if (existing) return res.status(400).json({ message: "Already subscribed!" });
    const subscriber = new Newsletter({ email: req.body.email });
    await subscriber.save();
    res.status(201).json({ success: true, message: "Subscribed successfully!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/", protect, async (req, res) => {
  try {
    const subscribers = await Newsletter.find().sort({ subscribedAt: -1 });
    res.json(subscribers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
