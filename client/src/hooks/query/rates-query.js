import {
    apiGetActiveRate,
    apiGetRateHistory,
    apiCreateRate,
    apiUpdateRate,
    apiDeleteRate
} from "@/api/rates.api";

import { useWrappedMutation } from "@/query-provider";
import { useQuery } from "@tanstack/react-query";

export const useMCreateRate = (options) => {
    return useWrappedMutation({
        ...options,
        mutationKey: ["rates"]
    }, async (data) => {
        return apiCreateRate(data);
    });
};

export const useMUpdateRate = (options) => {
    return useWrappedMutation({
        ...options,
        mutationKey: ["rates"]
    }, async ({ data, rateId }) => {
        return apiUpdateRate(data, rateId);
    });
};

export const useMDeleteRate = (options) => {
    return useWrappedMutation({
        ...options,
        mutationKey: ["rates"]
    }, async ({ data, rateId }) => {
        return apiDeleteRate(data, rateId);
    });
};

export const useGetActiveRateQuery = () => {
    return useQuery({
        queryKey: ["rates", "active"],
        queryFn: async () => (await apiGetActiveRate())?.data?.data,
    });
};

export const useGetRateHistoryQuery = () => {
    return useQuery({
        queryKey: ["rates", "history"],
        queryFn: async () => (await apiGetRateHistory())?.data?.data,
    });
};
