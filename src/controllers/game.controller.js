const Game = require("../models/game")
const AppError = require("../utils/AppError")
const catchAsync = require("../utils/catchAsync")


exports.getAllGames = catchAsync(async (req, res, next) => {

    const games = await Game.find({ isDeleted: false })

    res.status(200).json({
        success: true,
        gameCount: games.length,
        data: games
    })
})



exports.getDeletedGames = catchAsync(async (req, res, next) => {
    const games = await Game.find({ isDeleted: true }).select("+isDeleted +deletedAt")

    res.status(200).json({
        success: true,
        gameCount: games.length,
        data: games
    })
})

exports.getStatus = catchAsync(async (req, res, next) => {
    const status = await Game.aggregate([
        { $match: { isDeleted: false } },
        { $unwind: "$genre" },
        { $sort: { price: -1 } },
        {
            $group: {
                _id: "$genre",
                gameCount: { $sum: 1 },
                minPrice: { $min: "$price" },
                maxPrice: { $max: "$price" },
                avgPrice: { $avg: "$price" },
                game: { $first: "$$ROOT" },

            }
        },

    ])

    res.status(200).json({
        success: true,
        data: status
    })

})

exports.getOneGame = catchAsync(async (req, res, next) => {

    const game = await Game.findOne({ isDeleted: false, _id: req.params.id });


    if (!game) return next(new AppError(`No game found with this id ${req.params.id}`, 404))

    res.status(200).json({
        success: true,
        data: game
    })


})

exports.addGame = catchAsync(async (req, res, next) => {
    const game = await Game.create(req.body);
    game.isDeleted = undefined;
    res.status(201).json({
        success: true,
        message: `Game is created successfully`,
        data: game
    })

})

exports.updateGame = catchAsync(async (req, res, next) => {

    const game = await Game.findOneAndUpdate(
        { isDeleted: false, _id: req.params.id },
        { ...req.body, updatedAt: new Date() },
        { returnDocument: "after", runValidators: true })


    if (!game) return next(new AppError(`No game found with this id ${req.params.id}`, 404))


    res.status(200).json({
        success: true,
        message: `Game is updated successfully`,
        data: game
    })


})

exports.deleteGame = catchAsync(async (req, res, next) => {
    const game = await Game.findOneAndDelete(
        { isDeleted: false, _id: req.params.id },
    )

    if (!game) return next(new AppError(`No game found with this id ${req.params.id}`, 404))



    res.status(204).send()
})


exports.softDeleteGame = catchAsync(async (req, res, next) => {
    const game = await Game.findOneAndUpdate(
        { isDeleted: false, _id: req.params.id },
        { isDeleted: true, deletedAt: new Date() },
        { returnDocument: "after" }
    )

    if (!game) return next(new AppError(`No game found with this id ${req.params.id}`, 404))

    res.status(200).json({
        success: true,
        message: `Game is deleted successfully`,
        data: game
    })
})
