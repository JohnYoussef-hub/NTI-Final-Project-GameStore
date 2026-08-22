require("dotenv").config()
const express = require("express")
const path = require('path');
const morgan = require("morgan")
const productRouter=require("./routes/product.route");
const globalError = require("./middlewares/globalError")

const app = express()


app.use(express.json())
app.use(morgan("dev"))
app.use('/products',productRouter);


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