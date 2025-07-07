import queryClient from "@/config/queryClient";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const invalidateQueries = (queryKey?: string[]) => {
  queryClient.invalidateQueries(queryKey && { queryKey });
};
