import { useQuery } from "@tanstack/react-query";
import { apiGetSettlements } from "@/api/settlements-api";

export const useGetSettlementsQuery = (query) => {
  return useQuery({
    queryKey: ["settlements", query],
    queryFn: async () => (await apiGetSettlements(query))?.data?.data,
  });
};
