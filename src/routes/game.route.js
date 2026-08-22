const { getAllGames, getDeletedGames, getStatus, getOneGame, addGame, updateGame, deleteGame, softDeleteGame } = require("../controllers/game.controller");

const router = require("express").Router()

router.route("/").get(getAllGames).post(addGame);

router.route("/deleted-games").get(getDeletedGames);

router.route("/status").get(getStatus);

router.route("/:id").get(getOneGame).patch(updateGame).delete(deleteGame)

router.route("/:id/soft-deleted").patch(softDeleteGame)

module.exports = router;
