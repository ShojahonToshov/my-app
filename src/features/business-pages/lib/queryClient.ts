import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query';
import { toast } from 'sonner';

interface AxiosLikeError extends Error {
  response?: { status?: number };
  status?: number;
}

const handleGlobalError = (err: unknown) => {
  const error = err as AxiosLikeError;
  if (!navigator.onLine) {
    toast.error("Нет подключения к сети", { description: "Проверьте интернет-соединение" });
    return;
  }

  const status = error?.response?.status || error?.status;

  switch (status) {
    case 401:
    case 403:
      toast.error("Ошибка доступа", { description: "Пожалуйста, авторизуйтесь заново" });
      break;
    case 404:
      toast.error("Не найдено", { description: "Запрашиваемые данные отсутствуют" });
      break;
    case 500:
    case 502:
    case 503:
    case 504:
      toast.error("Ошибка сервера", { description: "Мы уже работаем над устранением" });
      break;
    default:
      if (error?.message === 'Network Error') {
        toast.error("Сетевая ошибка", { description: "Сервер недоступен" });
      } else {
        toast.error("Произошла ошибка", { description: error?.message || "Не удалось выполнить запрос" });
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
