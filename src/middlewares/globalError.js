const AppError = require("../utils/AppError");

const globalError = (err, req, res, next) => {

    console.log(err);
    let error = err

    if (err.kind == "ObjectId") error = new AppError(400, `not valid id ${err.value} it must be 24 char`)
    if (err.name == "ValidationError") {
        let message = Object.values(err.errors).map(err => err.message).join(", ").replaceAll("Path", "");
        error = new AppError(400, message)
    }
    if (err.code == 11000) error = new AppError(400, `Duplicated key the key is ${Object.entries(err.keyValue)[0][0]} and its value is ${Object.entries(err.keyValue)[0][1]}`)
    if (err.name == "TokenExpiredError") error = new AppError(401, 'please login again')
    if (err.name == "JsonWebTokenError") error = new AppError(401, 'Invalid token please login again')

    res.status(error.status || 500).json({
        success: false,
        message: error.message || 'Internal server error'
    })

}


module.exports = globalError