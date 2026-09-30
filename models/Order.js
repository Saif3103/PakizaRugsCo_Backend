import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerPhone: { type: String },
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  productName: { type: String },
  quantity: { type: Number, default: 1 },
  totalAmount: { type: Number },
  shippingAddress: { type: String },
  status: { type: String, enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"], default: "pending" },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Order", orderSchema);
