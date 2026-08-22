const { setServers } = require("dns/promises")
setServers(["8.8.8.8", "8.8.4.4"])
const app = require("./app");
app.set("query parser", "extended")
const connectDB = require("./config/ConnectDB");


connectDB()

const port = process.env.PORT || 5000

app.listen(port, () => {
    console.log(`Server is running at port ${port}`);
})