const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Game title is required"],
            unique: true,
            trim: true,
            minLength: [3, "min char for name is 3 char"],
            maxLength: [50, "game must be below 50 char"],
        },
        price: {
            type: Number,
            required: [true, "Game price is required"],
            min: [1, "value must be positive"],
        },
        stock: {
            type: Number,
            required: [true, "Game stock is required"],
            min: [0, "value must be positive"],
        },

        genre: {
            type: String,
            required: true,
            trim: true
        },

        platform: [{
            type: String,
            required: true,
            enum: ["PC", "PlayStation", "Xbox", "Nintendo"],
        }
        ],
        images: [
            {
                type: String,
                required: true,
            }
        ],
        description: {
            type: String,
            required: [true, "Game description is required"],
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

const Game = mongoose.model("game", gameSchema);

module.exports = Game;