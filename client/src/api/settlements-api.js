import apiClient from "./client"

export const apiGetSettlements = (query) => {
    return apiClient.get(`/settlements?${query}`)
}