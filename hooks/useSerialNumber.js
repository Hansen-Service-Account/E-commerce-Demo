import useSWR from "swr";
import { HANSEN_CPQ_BASE_URL } from "../utils/constants";
import fetcher from "../utils/fetchJson";

const useSerialNumber = (quoteId) => {
  const { data, error, mutate } = useSWR(
    `${HANSEN_CPQ_BASE_URL}/quotes/${quoteId}/externalLookup/CheckAvailableSerialNumbers`,
    fetcher
  );
  return {
    serialNumber: data,
    isLoading: !error && !data,
    isError: error,
    mutateSerialNumber: mutate,
  };
};

export default useSerialNumber;
