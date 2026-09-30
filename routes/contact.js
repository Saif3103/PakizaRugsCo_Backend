import express from "express";
import Contact from "../models/Contact.js";
import protect from "../middleware/auth.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const contact = new Contact(req.body);
    await contact.save();
    res.status(201).json({ success: true, message: "Message received! We will contact you soon." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get("/", protect, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
