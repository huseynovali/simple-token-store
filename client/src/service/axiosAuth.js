import axios from "axios";

export const axiosAuth = axios.create({
  baseURL: 'http://localhost:3000/api/auth',
  withCredentials: true, // Cookie'lerin gönderilmesi için gerekli
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});