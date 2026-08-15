import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query';
import { toast } from 'sonner';

const handleGlobalError = (error: unknown) => {
  if (!navigator.onLine) {
    toast.error("No internet connection", { description: "Please check your network connection" });
    return;
  }

  const err = error as {response?: {status?: number}, status?: number, message?: string};
  const status = err?.response?.status || err?.status;

  switch (status) {
    case 401:
    case 403:
      toast.error("Access denied", { description: "Please sign in again" });
      break;
    case 404:
      toast.error("Not found", { description: "The requested data does not exist" });
      break;
    case 500:
    case 502:
    case 503:
    case 504:
      toast.error("Server error", { description: "Our team is already working on a fix" });
      break;
    default:
      if (err?.message === 'Network Error') {
        toast.error("Network error", { description: "Server is unreachable" });
      } else {
        toast.error("An error occurred", { description: err?.message || "Failed to complete request" });
      }
      break;
  }
};

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: handleGlobalError
  }),
  mutationCache: new MutationCache({
    onError: handleGlobalError
  }),
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 15, // 15 minutes
      retry: (failureCount: number, error: unknown) => {
        const err = error as {response?: {status?: number}, status?: number, message?: string};
        const status = err?.response?.status || err?.status;
        if (status === 401 || status === 403 || status === 404) return false;
        return failureCount < 2;
      },
      refetchOnWindowFocus: false, 
      refetchOnReconnect: true,
      refetchOnMount: false,
    },
  },
});
