const { getDashboard } = require("../controllers/admin.controller")
const auth = require("../middlewares/auth")
const restrictTo = require("../middlewares/restrictTo")

const router = require("express").Router()

router.get("/", auth, restrictTo("admin"), getDashboard)

module.exports = router