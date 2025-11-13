// src/services/api/authApi.js
import axios from "axios";

const chatApi = axios.create({
  baseURL: import.meta.env.VITE_DOCTOR_API_URL || "http://localhost:8080",
  headers: { "Content-Type": "application/json" },
});

export default chatApi;
