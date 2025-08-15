import {
  MutationCache,
  QueryClient,
  QueryClientProvider,
  useMutation,
} from "@tanstack/react-query";
import React from "react";

const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    onSuccess: (data, variables, context, mutation) => {
      mutation.options.mutationKey?.forEach((key) => {
        queryClient.invalidateQueries({
          queryKey: [key],
        });
      });
    },
  }),
});

export function useWrappedMutation(options, fn) {
  return useMutation({
    ...options,
    mutationFn: (data) => {
      return fn(data);
    },
  });
}

export function QueryProvider({ children }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
