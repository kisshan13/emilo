import { apiAuthLogin, apiAuthLogout, apiAuthSignup } from "@/api/auth.api";
import { useWrappedMutation } from "@/query-provider";
import { useQuery } from "@tanstack/react-query";

/**
 * @param {import("@/types").OmittedMutationFunction}
 */
export const useMAuthLogin = (options) => {
    return useWrappedMutation({
        ...options,
        mutationKey: ["user"]
    }, async (data) => {
        return apiAuthLogin(data)
    })
}

/**
 * @param {import("@/types").OmittedMutationFunction}
 */
export const useMAuthSignup = (options) => {
    return useWrappedMutation({
        ...options,
        mutationKey: ["user"]
    }, async (data) => {
        return apiAuthSignup(data)
    })
}

/**
 * @param {import("@/types").OmittedMutationFunction}
 */
export const useAuthLogoutQuery = () => {
    return useQuery({
        queryKey: ['user'],
        queryFn: async () => apiAuthLogout()
    })
}