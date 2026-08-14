import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query';
import { toast } from 'sonner';

const handleGlobalError = (error: unknown) => {
  if (!navigator.onLine) {
    toast.error("Нет подключения к сети", { description: "Проверьте интернет-соединение" });
    return;
  }

  const err = error as {response?: {status?: number}, status?: number, message?: string};
  const status = err?.response?.status || err?.status;

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
      if (err?.message === 'Network Error') {
        toast.error("Сетевая ошибка", { description: "Сервер недоступен" });
      } else {
        toast.error("Произошла ошибка", { description: err?.message || "Не удалось выполнить запрос" });
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
