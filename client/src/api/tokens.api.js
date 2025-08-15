import apiClient from "./client";

export const apiGetTokenForSocket = () => {
    return apiClient.get("/tokens")
}