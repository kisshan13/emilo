import apiClient from "./client";

export const apiGetActiveRate = () => {
    return apiClient.get("/rates/active")
}

export const apiGetRateHistory = () => {
    return apiClient.get(`/rates/history`)
}

export const apiCreateRate = (data) => {
    return apiClient.post(`/rates`, data)
}

export const apiUpdateRate = (data, rateId) => {
    return apiClient.put(`/rates/${rateId}`, data)
}

export const apiDeleteRate = (data, rateId) => {
    return apiClient.delete(`/rates/${rateId}`)
}