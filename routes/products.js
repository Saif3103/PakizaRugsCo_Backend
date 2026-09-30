import express from "express";
import Product from "../models/Product.js";
import protect from "../middleware/auth.js";
import { uploadProduct, cloudinary } from "../config/cloudinary.js";

const router = express.Router();

// GET - All products (public)
router.get("/", async (req, res) => {
  try {
    const { category, color, inStock } = req.query;
    let filter = {};
    if (category) filter.category = category;
    if (color) filter.color = { $in: [color] };
    if (inStock !== undefined) filter.inStock = inStock === "true";
    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET - Featured products (public)
router.get("/featured", async (req, res) => {
  try {
    const products = await Product.find({ featured: true, inStock: true });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET - Single product (public)
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST - Add product with images (Admin only)
router.post("/", protect, uploadProduct.array("images", 10), async (req, res) => {
  try {
    const imageUrls = req.files ? req.files.map((f) => f.path) : [];
    const product = new Product({ ...req.body, images: imageUrls });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT - Update product with optional new images (Admin only)
router.put("/:id", protect, uploadProduct.array("images", 10), async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.files && req.files.length > 0) {
      updateData.images = req.files.map((f) => f.path);
    }
    const product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE - Delete product + its Cloudinary images (Admin only)
router.delete("/:id", protect, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Delete images from Cloudinary
    for (const imageUrl of product.images) {
      const publicId = imageUrl.split("/").slice(-2).join("/").split(".")[0];
      await cloudinary.uploader.destroy(publicId);
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product and images deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
