import apiClient from "./client";

export const apiCreateClaim = (data) => {
    return apiClient.post("/claims", data)
}

/**
 * 
 * @param {string} claimId 
 * @param {"settlement_ok" | "settlement_dispute"} status 
 */
export const apiClaimSettle = (claimId, status) => {
    return apiClient.patch(`/claims/${claimId}/settle`, { status })
}

export const apiClaimDeduct = (claimId, data) => {
    return apiClient.patch(`/claims/${claimId}/deduct`, data)
}

export const apiClaimAccountantApprove = (claimId) => {
    return apiClient.post(`/claims/${claimId}/acc-approved`)
}

/**
 * 
 * @param {string} claimId 
 * @param {"approved" | "rejected"} status 
 */
export const apiClaimApproval = (claimId, status) => {
    return apiClient.patch(`/claims/${claimId}/approve`, { status })
}

export const apiGetClaims = (query) => {
    const url = query ? `/claims?${query}` : "/claims";
    return apiClient.get(url)
}

export const apiGetClaimById = (id) => {
    return apiClient.get(`/claims/${id}`)
}