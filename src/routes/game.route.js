const { getAllGames, getDeletedGames, getStatus, getOneGame, addGame, updateGame, deleteGame, softDeleteGame } = require("../controllers/game.controller");
const auth = require("../middlewares/auth")
const restrictTo = require("../middlewares/restrictTo")

const router = require("express").Router()

router.route("/").get(getAllGames).post(auth, restrictTo("admin"), addGame);

router.route("/deleted-games").get(getDeletedGames);

router.route("/status").get(getStatus);

router.route("/:id").get(getOneGame)
	.patch(auth, restrictTo("admin"), updateGame)
	.delete(auth, restrictTo("admin"), deleteGame)

router.route("/:id/soft-deleted").patch(auth, restrictTo("admin"), softDeleteGame)

module.exports = router;
