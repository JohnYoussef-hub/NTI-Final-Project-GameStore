const { getAllProducts, getDeletedProducts, getStatus, getOneProduct, addProduct, updateProduct, deleteProduct, softDeleteProduct } = require("../controllers/product.controller");

const router = require("express").Router()

router.route("/").get(getAllProducts).post(addProduct);

router.route("/deleted-products").get(getDeletedProducts);

router.route("/status").get(getStatus);

router.route("/:id").get(getOneProduct).patch(updateProduct).delete(deleteProduct)

router.route("/:id/soft-deleted").patch(softDeleteProduct)

module.exports = router;