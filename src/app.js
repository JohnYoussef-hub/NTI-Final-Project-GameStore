require("dotenv").config()
const express = require("express")
const path = require('path');
const morgan = require("morgan")
const gameRouter = require("./routes/game.route");
const wishlistRouter = require("./routes/wishlist.route");
const userRouter = require("./routes/user.route");
const globalError = require("./middlewares/globalError")

const app = express()


app.use(express.json())
app.use(morgan("dev"))
app.use('/games', gameRouter);
app.use('/wishlist', wishlistRouter);
app.use('/users', userRouter);


app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome to server"
    })
})


app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, "views", "Error.html"));
});

app.use(globalError)


module.exports = app