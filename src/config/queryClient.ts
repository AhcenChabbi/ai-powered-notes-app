import { QueryClient } from "@tanstack/react-query";
const FIVE_MINS = 1000 * 60 * 5;
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: FIVE_MINS,
    },
  },
});

export default queryClient;
