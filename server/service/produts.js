const products = [
  { id: 1, name: "Product 1", price: 100 },
    { id: 2, name: "Product 2", price: 200 },
    { id: 3, name: "Product 3", price: 300 },
];

const ProductService = {
  getProducts: async () => {
    return products;
  },
  getProductById: async (id) => {
    const product = products.find((p) => p.id === id);
    if (!product) {
      throw new Error("Product not found");
        }
        return product;
    },
};

module.exports = ProductService;