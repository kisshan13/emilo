import { useQuery } from "@tanstack/react-query";
import { apiGetTokenForSocket } from "@/api/tokens.api";

export const useGetSocketTokenQuery = () => {
    return useQuery({
        queryKey: ["token"],
        queryFn: async () => (await apiGetTokenForSocket())?.data?.data,
    });
};
