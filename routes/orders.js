import express from "express";
import Order from "../models/Order.js";
import protect from "../middleware/auth.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.status(201).json({ success: true, message: "Order placed successfully!", orderId: order._id });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get("/", protect, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/:id", protect, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
