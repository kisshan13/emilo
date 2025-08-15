import {
    apiCreateClaim,
    apiClaimSettle,
    apiClaimDeduct,
    apiClaimAccountantApprove,
    apiClaimApproval,
    apiGetClaims,
    apiGetClaimById
} from "@/api/claims.api";

import { useWrappedMutation } from "@/query-provider";
import { useQuery } from "@tanstack/react-query";


export const useMCreateClaim = (options) => {
    return useWrappedMutation({
        ...options,
        mutationKey: ["claims", "posts"]
    }, async (data) => {
        return apiCreateClaim(data);
    });
};


export const useMClaimSettle = (options) => {
    return useWrappedMutation({
        ...options,
        mutationKey: ["claims"]
    }, async ({ claimId, status }) => {
        return apiClaimSettle(claimId, status);
    });
};


export const useMClaimDeduct = (options) => {
    return useWrappedMutation({
        ...options,
        mutationKey: ["claims"]
    }, async ({ claimId, data }) => {
        console.log(claimId, data)
        return apiClaimDeduct(claimId, data);
    });
};


export const useMClaimAccountantApprove = (options) => {
    return useWrappedMutation({
        ...options,
        mutationKey: ["claims"]
    }, async ({ claimId }) => {
        return apiClaimAccountantApprove(claimId);
    });
};

export const useMClaimApproval = (options) => {
    return useWrappedMutation({
        ...options,
        mutationKey: ["claims"]
    }, async ({ claimId, status }) => {
        return apiClaimApproval(claimId, status);
    });
};

export const useGetClaimsQuery = (query) => {
    return useQuery({
        queryKey: ["claims", query],
        queryFn: async () => (await apiGetClaims(query))?.data?.data,
    });
};


export const useGetClaimByIdQuery = (claimId) => {
    return useQuery({
        queryKey: ["claims", claimId],
        queryFn: async ({ queryKey }) => (await apiGetClaimById(queryKey[1]))?.data?.data,
        enabled: !!claimId,
    });
};
