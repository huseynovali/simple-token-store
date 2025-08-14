const express = require("express");
const { authMiddleware } = require("../middleware/authMiddleware");
const productController = require("../controller/products");

const router = express.Router();

router.get("/", authMiddleware, productController.getProducts);

router.get("/:id", authMiddleware, productController.getProductById);

module.exports = router;
