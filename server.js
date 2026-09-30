import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import contactRoutes from "./routes/contact.js";
import productRoutes from "./routes/products.js";
import orderRoutes from "./routes/orders.js";
import adminRoutes from "./routes/admin.js";
import newsletterRoutes from "./routes/newsletter.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || "*" }));
app.use(express.json());

app.use("/api/contact", contactRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/newsletter", newsletterRoutes);

app.get("/", (req, res) => res.send("Pakiza Rugs Co API Running ✅"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
