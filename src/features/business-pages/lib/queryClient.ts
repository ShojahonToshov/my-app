import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query';
import { toast } from 'sonner';

interface AxiosLikeError extends Error {
  response?: { status?: number };
  status?: number;
}

const handleGlobalError = (err: unknown) => {
  const error = err as AxiosLikeError;
  if (!navigator.onLine) {
    toast.error("No internet connection", { description: "Please check your connection" });
    return;
  }

  const status = error?.response?.status || error?.status;

  switch (status) {
    case 401:
    case 403:
      toast.error("Access denied", { description: "Please sign in again" });
      break;
    case 404:
      toast.error("Not found", { description: "The requested data doesn't exist" });
      break;
    case 500:
    case 502:
    case 503:
    case 504:
      toast.error("Server error", { description: "We're working on a fix" });
      break;
    default:
      if (error?.message === 'Network Error') {
        toast.error("Network error", { description: "Server unavailable" });
      } else {
        toast.error("Something went wrong", { description: error?.message || "Failed to complete the request" });
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
      retry: (failureCount: number, err: unknown) => {
        const error = err as AxiosLikeError;
        const status = error?.response?.status || error?.status;
        if (status === 401 || status === 403 || status === 404) return false;
        return failureCount < 2;
      },
      refetchOnWindowFocus: false, 
      refetchOnReconnect: true,
      refetchOnMount: false,
    },
  },
});
