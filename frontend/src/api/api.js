import { fetchBaseQuery } from "@reduxjs/toolkit/query";

export const apiBaseUrl =
  process.env.REACT_APP_API_PATH === "production"
    // ? "https://mono-v9zs.onrender.com"
    ? "https://mono-app-mern-stack-project-pwcp.vercel.app"
    : "http://localhost:9000";



    export const baseQueryWithAuth = fetchBaseQuery({
      baseUrl: apiBaseUrl,
      prepareHeaders: (headers) => {
        // localStorage'dan token'i al
        const token = localStorage.getItem('token');
        if (token) {
          headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
      },
    });