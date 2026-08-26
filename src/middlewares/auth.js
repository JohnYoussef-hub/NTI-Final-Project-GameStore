const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const User = require("../models/user.model")
const auth = async (req,res,next) => {
    if (req.headers.authorization) {
        const token = req.headers.authorization.split(" ")[1]    // 'Bearer token'
        const decode = jwt.verify(token,process.env.SECRET_KEY)
        const user = await User.findOne({isDeleted:false, _id:decode.id}).select("+role")
        req.user = user
        next()
    } else {
        return next(new AppError(400, 'please login first'))
    }
}

module.exports = auth