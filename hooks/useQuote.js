import useSWR from "swr";
import fetcher from "../utils/fetcher";

const useQuote = (quoteId) => {
  const { data, error, mutate } = useSWR(
    `/api/quotes/${quoteId}?include=pricing,quotePricing`,
    fetcher
  );
  return {
    quote: data,
    isLoading: !error && !data,
    isError: error,
    mutateQuote: mutate,
  };
};

export default useQuote;
