const Wishlist = require("../models/wishlist.model")
const User = require("../models/user.model")
const Game = require("../models/game")
const AppError = require("../utils/AppError")
const catchAsync = require("../utils/catchAsync")

// GET /wishlist/:userId  -> view wishlist (populated with game details)
exports.getWishlist = catchAsync(async (req, res, next) => {
    const wishlist = await Wishlist.findOne({ user: req.params.userId })
        .populate("games")

    if (!wishlist) {
        return res.status(200).json({
            status: "success",
            message: "Wishlist is empty",
            results: 0,
            data: {
                wishlist: []
            }
        })
    }

    res.status(200).json({
        status: "success",
        message: "Wishlist fetched successfully",
        results: wishlist.games.length,
        data: {
            wishlist: wishlist.games
        }
    })
})

// POST /wishlist/:userId  body: { gameId } -> add game to wishlist
exports.addToWishlist = catchAsync(async (req, res, next) => {
    const { gameId } = req.body

    if (!gameId) {
        return next(new AppError("gameId is required", 400))
    }

    const user = await User.findOne({ isDeleted: false, _id: req.params.userId })
    if (!user) {
        return next(new AppError("No user found with that ID", 404))
    }

    const game = await Game.findOne({ isDeleted: false, _id: gameId })
    if (!game) {
        return next(new AppError("No game found with that ID", 404))
    }

    const wishlist = await Wishlist.findOneAndUpdate(
        { user: req.params.userId },
        { $addToSet: { games: gameId } },
        { new: true, upsert: true, runValidators: true }
    ).populate("games")

    res.status(200).json({
        status: "success",
        message: "Game added to wishlist successfully",
        results: wishlist.games.length,
        data: {
            wishlist: wishlist.games
        }
    })
})

// DELETE /wishlist/:userId/:gameId -> remove game from wishlist
exports.removeFromWishlist = catchAsync(async (req, res, next) => {
    const wishlist = await Wishlist.findOneAndUpdate(
        { user: req.params.userId },
        { $pull: { games: req.params.gameId } },
        { returnDocument: "after", runValidators: true }
    ).populate("games")

    if (!wishlist) {
        return next(new AppError("No wishlist found for that user", 404))
    }

    res.status(200).json({
        status: "success",
        message: "Game removed from wishlist successfully",
        results: wishlist.games.length,
        data: {
            wishlist: wishlist.games
        }
    })
})