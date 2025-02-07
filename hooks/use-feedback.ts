import useSWR from "swr";
import type { Feedback } from "@/types/feedback";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useFeedback() {
  const { data, error, isLoading, mutate } = useSWR<Feedback[]>(
    "/api/feedback",
    fetcher
  );

  return {
    data,
    isLoading,
    error,
    mutate,
  };
}
