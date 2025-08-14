import { axiosPrivate } from "./axiosService";

export const ProductService = {
  getProducts: async () => await axiosPrivate.get("/products"),
  getProductById: async (id) => await axiosPrivate.get(`/products/${id}`),
}

