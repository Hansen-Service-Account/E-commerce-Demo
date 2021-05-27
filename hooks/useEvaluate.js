import useSWR from "swr";
import { HANSEN_CPQ_BASE_URL } from "../utils/constants";
import fetcher from "../utils/fetchJson";

const useEvaluate = (quoteId, itemId) => {
  const { data, error, mutate } = useSWR(
    `${HANSEN_CPQ_BASE_URL}/quotes/${quoteId}/items/${itemId}/evaluateRules`,
    fetcher
  );
  return {
    result: data,
    isLoading: !error && !data,
    isError: error,
    mutateResult: mutate,
  };
};

export default useEvaluate;
