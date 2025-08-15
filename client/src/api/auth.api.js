import apiClient from "./client";

export const apiAuthLogin = (data) => {
    return apiClient.post("/auth/login", data)
}

export const apiAuthSignup = (data) => {
    return apiClient.post("/auth/signup", data)
}

export const apiAuthLogout = () => {
    return apiClient.get("/auth/logout")
}