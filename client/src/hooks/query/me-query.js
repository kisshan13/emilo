import { apiGetMe } from "@/api/me.api"
import { useQuery } from "@tanstack/react-query"

export const useGetMeQuery = () => {
    return useQuery({
        queryKey: ['user'],
        queryFn: async () => (await apiGetMe())?.data?.data,
        retry: 0,
    })
}