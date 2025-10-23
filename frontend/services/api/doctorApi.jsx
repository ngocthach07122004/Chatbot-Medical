// src/services/api/authApi.js
import axios from "axios";

const doctorApi = axios.create({
  baseURL: import.meta.env.VITE_DOCTOR_API_URL || "http://localhost:8080",
  headers: { "Content-Type": "application/json" },
});

// authApi.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

export default doctorApi;
