import useSWR from "swr";
import { HANSEN_CPQ_V2_BASE_URL } from "../utils/constants";
import fetcher from "../utils/fetchJson";

const useOrders = (customerId) => {
  const { data, error, mutate } = useSWR(
    `${HANSEN_CPQ_V2_BASE_URL}/customers/${customerId}/orders`,
    fetcher
  );

  return {
    orders: data,
    isLoading: !error && !data,
    isError: error,
    mutateOrders: mutate,
  };
};

export default useOrders;
