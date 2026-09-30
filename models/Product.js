import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  category: { type: String },
  material: { type: String },
  size: [String],
  color: [String],
  images: [String],
  inStock: { type: Boolean, default: true },
  featured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Product", productSchema);
