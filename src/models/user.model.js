const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: [3, "min char for name is 3"],
        maxLength: [30, "name must be below 30 char"],
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minLength: [4, "min char for password is 4 char"],
        select: false
    },
    image: String,
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
        select: false
    },
    isDeleted: {
        type: Boolean,
        default: false,
        select: false
    },
    isActive: {
        type: Boolean,
        default: false
    },
    confirmOTP: {
        type: String,
        select: false
    },
    OTPExpire: {
        type: Date,
        select: false
    },
    resetToken: String,
    resetTokenExpire: Date

}, {
    timestamps: true,
    versionKey: false
})

const user = mongoose.model("user", userSchema);

module.exports = user