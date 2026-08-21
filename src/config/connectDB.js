const mongoose = require("mongoose")


async function connectDB() {
    try {
        const con = await mongoose.connect(process.env.PRODUCTION_DATABASE)
        console.log(`Database is connected successfully at ${con.connection.name}`);
    } catch (error) {
        console.log(error);
    }

}

module.exports = connectDB