import useSWR from "swr";
import { HANSEN_CPQ_BASE_URL } from "../utils/constants";
import fetcher from "../utils/fetchJson";

const useQuote = (quoteId) => {
  const { data, error, mutate } = useSWR(
    `${HANSEN_CPQ_BASE_URL}/quotes/${quoteId}?include=quotePricing,pricing,validation`,
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
