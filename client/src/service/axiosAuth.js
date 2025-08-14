import axios from "axios";

export const axiosAuth = axios.create({
  baseURL: "http://localhost:3000/api/auth",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});


