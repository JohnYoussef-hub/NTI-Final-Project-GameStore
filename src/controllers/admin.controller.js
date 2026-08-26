const Game = require("../models/game.model")
const User = require("../models/user.model")
const catchAsync = require("../utils/catchAsync")

exports.getDashboard = catchAsync(async (req, res, next) => {
    const [totalGames, activeGames, deletedGames, totalUsers, adminUsers, gameStatus] = await Promise.all([
        Game.countDocuments(),
        Game.countDocuments({ isDeleted: false }),
        Game.countDocuments({ isDeleted: true }),
        User.countDocuments({ isDeleted: false }),
        User.countDocuments({ isDeleted: false, role: "admin" }),
        Game.aggregate([
            { $match: { isDeleted: false } },
            { $group: { _id: "$genre", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ])
    ])

    res.status(200).json({
        success: true,
        data: {
            totalGames,
            activeGames,
            deletedGames,
            totalUsers,
            adminUsers,
            gameStatus
        }
    })
})