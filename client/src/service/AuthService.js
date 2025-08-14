import { axiosAuth } from "./axiosAuth";

export const AuthService = {
  login: async (email, password) =>
    await axiosAuth.post("/login", { email, password }),
  register: async (email, password, name) =>
    await axiosAuth.post("/register", { email, password, name }),
  refreshToken: async () => await axiosAuth.post("/refresh-token"),

  logout: async () => await axiosAuth.post("/logout"),
};
