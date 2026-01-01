import axios from "axios";

// Use environment variable for production, fallback to localhost for local dev
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000/api/runs",
});
