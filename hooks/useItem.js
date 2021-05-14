import useSWR from "swr";
import fetcher from "../utils/fetcher";

const useItem = (quoteId, itemId) => {
  const { data, error, mutate } = useSWR(
    `/api/quotes/${quoteId}/items/${itemId}?include=pricing,quotePricing,specification,candidate,validation,quote`,
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
