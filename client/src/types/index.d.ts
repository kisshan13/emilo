import { UseMutationOptions } from "@tanstack/react-query";

export type OmittedMutationFunction<T> = Omit<UseMutationOptions<unknown, any, T>, "mutationFn">;