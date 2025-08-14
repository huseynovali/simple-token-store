const ProductService = require("../service/produts");

const productController = {
  getProducts: async (req, res) => {
    try {
      const products = await ProductService.getProducts();
      return res.status(200).json({
        success: true,
        data: products,
      });
    } catch (error) {
      console.error("ProductController getProducts error:", error);
      return res.status(500).json({
        success: false,
        message: "Sunucu hatası",
        error: error.message,
      });
    }
  },
  getProductById: async (req, res) => {
    const productId = parseInt(req.params.id);
    try {
      const product = await ProductService.getProductById(productId);
      return res.status(200).json({
        success: true,
        data: product,
      });
    } catch (error) {
      console.error("ProductController getProductById error:", error);
      return res.status(500).json({
        success: false,
        message: "Sunucu hatası",
        error: error.message,
      });
    }
  },
};

module.exports = productController;
