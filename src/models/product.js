const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Product title is required"],
      unique: true,
      trim: true,
      minLength: [3, "min char for name is 3 char"],
      maxLength: [50, "product must be below 50 char"], 
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [1, "value must be positive"],
    },
    stock: {
      type: Number,
      required: [true, "Product stock is required"],
      min: [0, "value must be positive"],
    },
    
    genre :{
      type :String,
      required:true,
      trim:true
    },

    platform: [{
        type: String,
        required: true,
        enum: ["PC", "PlayStation", "Xbox", "Nintendo"], 
      }
    ],
    images:[ 
      {
        type: String,
        required: true,
      }
    ],
    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
    },
    
    isDeleted: {
      type: Boolean,
      default: false,
      select: false,
    },
    deletedAt: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Product = mongoose.model("product", productSchema);

module.exports = Product;