const { getAllUsers, getUser, createUser, softDeleteUser, deleteUser, updateUser } = require("../controllers/user.controller")
// const auth = require("../middlewares/auth")
// const restrictTo = require("../middlewares/restrictTo")

// const router = require("express").Router()

// router.route("/").get(restrictTo("admin"), getAllUsers).post(restrictTo("admin"), createUser)


//     router.route("/deleted-users").get(restrictTo("admin"), getDeletedUser)
//     router.route("/get-states").get(restrictTo("admin"), getStates)

//     router.route("/:id").get(getOneUser).patch(restrictTo("admin"), updateUser).delete(restrictTo("admin"), deleteUser)
//     router.route("/:id/soft-deleted").patch(restrictTo("admin"), softDeleteUser)

//     module.exports = router