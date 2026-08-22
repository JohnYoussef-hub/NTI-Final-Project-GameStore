const { getWishlist, addToWishlist, removeFromWishlist } = require("../controllers/wishlist.controller")

const router = require("express").Router()

router.route("/:userId").get(getWishlist).post(addToWishlist)

router.route("/:userId/:gameId").delete(removeFromWishlist)

module.exports = router