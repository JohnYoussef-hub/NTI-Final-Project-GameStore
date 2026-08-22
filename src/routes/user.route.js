const { getAllUsers, getUser, createUser, softDeleteUser, deleteUser, updateUser } = require("../controllers/user.controller")

const router = require("express").Router()

router.route("/").get(getAllUsers).post(createUser)

router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser)
router.route("/:id/soft-deleted").patch(softDeleteUser)

module.exports = router