require("dotenv").config()
const express = require("express")
const morgan = require("morgan")

const globalError = require("./middlewares/globalError")

const app = express()


app.use(express.json())
app.use(morgan("dev"))


app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome to server"
    })
})


app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: '404 Page not Found'
    })
})

app.use(globalError)


module.exports = app