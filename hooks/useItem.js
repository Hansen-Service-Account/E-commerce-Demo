import useSWR from "swr";
import { HANSEN_CPQ_BASE_URL } from "../utils/constants";
import fetcher from "../utils/fetchJson";

const useItem = (quoteId, itemId) => {
  const { data, error, mutate } = useSWR(
    `${HANSEN_CPQ_BASE_URL}/quotes/${quoteId}/items/${itemId}?include=pricing,quotePricing,specification,candidate,validation`,
    fetcher
  );
  return {
    item: data,
    isLoading: !error && !data,
    isError: error,
    mutateItem: mutate,
  };
};

export default useItem;
