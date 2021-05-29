import useSWR from "swr";
import { HANSEN_CPQ_BASE_URL } from "../utils/constants";
import fetcher from "../utils/fetchJson";

const useOrder = (orderId) => {
  const { data, error, mutate } = useSWR(
    `${HANSEN_CPQ_BASE_URL}/orders/${orderId}`,
    fetcher
  );
  return {
    order: data,
    isLoading: !error && !data,
    isError: error,
    mutateOrder: mutate,
  };
};

export default useOrder;
