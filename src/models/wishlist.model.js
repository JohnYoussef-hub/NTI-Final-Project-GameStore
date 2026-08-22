const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: [true, "Wishlist must belong to a user"],
            unique: true
        },
        games: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "game"
            }
        ]
    },
    {
        timestamps: true,
        versionKey: false
    }
);

const Wishlist = mongoose.model("wishlist", wishlistSchema);

module.exports = Wishlist;