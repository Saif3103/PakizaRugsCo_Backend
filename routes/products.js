import express from "express";
import Product from "../models/Product.js";
import protect from "../middleware/auth.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const products = await Product.find({ inStock: true });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/featured", async (req, res) => {
  try {
    const products = await Product.find({ featured: true, inStock: true });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", protect, async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/:id", protect, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/:id", protect, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
