const User = require("../models/user.model")
const AppError = require("../utils/AppError")
const catchAsync = require("../utils/catchAsync")

exports.getAllUsers = catchAsync(async (req, res, next) => {
    const users = await User.find()
    res.status(200).json({
        status: "success",
        mesage: "Users fetched successfully",
        results: users.length,
        data: {
            users
        }
    })
})

exports.getUser = catchAsync(async (req, res, next) => {
    const user = await User.findOne({ isDeleted: false, _id: req.params.id })
    if (!user) {
        return next(new AppError("No user found with that ID", 404))
    }

    res.status(200).json({
        status: "success",
        message: "User fetched successfully",
        data: {
            user
        }
    })
})

exports.createUser = catchAsync(async (req, res, next) => {
    const user = await User.create(req.body)
    res.status(201).json({
        status: "success",
        message: "User created successfully",
        data: {
            user
        }
    })
})

exports.updateUser = catchAsync(async (req, res, next) => {
    const user = await User.findOneAndUpdate({ isDeleted: false, _id: req.params.id },
        { ...req.body, updatedAt: Date.now() },
        {
            returnDocument: "after",
            runValidators: true
        })
    if (!user) {
        return next(new AppError("No user found with that ID", 404))
    }
    res.status(200).json({
        status: "success",
        message: "User updated successfully",
        data: {
            user
        }
    })
})

exports.softDeleteUser = catchAsync(async (req, res, next) => {
    const user = await User.findOneAndUpdate({ isDeleted: false, _id: req.params.id },
        { isDeleted: true, updatedAt: Date.now() },
        {
            returnDocument: "after",
            runValidators: true
        })
    if (!user) {
        return next(new AppError("No user found with that ID", 404))
    }
    res.status(200).json({
        status: "success",
        message: "User deleted successfully",
        data: {
            user
        }
    })
})

exports.deleteUser = catchAsync(async (req, res, next) => {
    const user = await User.findOneAndDelete({ isDeleted: false, _id: req.params.id })
    if (!user) {
        return next(new AppError("No user found with that ID", 404))
    }
    res.status(200).json({
        status: "success",
        message: "User deleted successfully",
        data: {
            user
        }
    })
})




