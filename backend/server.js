/* eslint-env node */
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";
import productRoutes from "./routes/productRoutes.js"
import homeSectionRoutes from "./routes/homeSectionRoutes.js"

dotenv.config();

const app = express();


app.use(cors());
app.use(express.json());
app.use("/api/products", productRoutes);
app.use("/api/home-sections", homeSectionRoutes);



mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("Mongo error:", err));

app.get("/", (req, res) => {
  res.send("Server is running");
});


const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

app.post("/create-order", async (req, res) => {
  try {
    const order = await razorpay.orders.create({
      amount: Number(req.body.amount) * 100,
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    });

    res.json(order);
  } catch (error) {
    console.error("Order creation failed:", error);
    res.status(500).send(error);
  }
});


// 2️⃣ Verify Payment
app.post("/verify-payment", (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ status: "failure", reason: "Missing fields" });
  }

  const sign = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSign = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(sign)
    .digest("hex");

  if (expectedSign === razorpay_signature) {
    return res.json({ status: "success" });
  } else {
    return res.status(400).json({ status: "failure" });
  }
});



const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
