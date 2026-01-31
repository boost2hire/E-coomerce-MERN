import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },

    category: {
      type: String,
      enum: ["women", "men", "kids", "accessories"],
      required: true
    },

    subCategory: {
      type: String,
      enum: ["tshirt", "hoodie", "jeans", "jacket", "dress", "cap", "bag", "wallet", "crop top", "pants", "glasses", ],
      required: true
    },

    stock: { type: Number, default: 1 }
  },
  { timestamps: true }
);


export default mongoose.model("Product", productSchema);