// src/services/api/authApi.js
import axios from "axios";

const patientApi = axios.create({
  baseURL: import.meta.env.VITE_PATIENT_API_URL || "http://localhost:8081",
  headers: { "Content-Type": "application/json" },
});

// authApi.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

export default patientApi;
