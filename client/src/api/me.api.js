import apiClient from "./client"

export const apiGetMe = () => {
    return apiClient.get("/me")
}