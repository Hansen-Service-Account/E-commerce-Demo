import useSWR from "swr";
import { HANSEN_CPQ_BASE_URL } from "../utils/constants";
import fetcher from "../utils/fetchJson";

const usePhoneNumber = (quoteId) => {
  const { data, error, mutate } = useSWR(
    `${HANSEN_CPQ_BASE_URL}/quotes/${quoteId}/externalLookup/CheckAvailableNumbers`,
    fetcher
  );
  return {
    phoneNumber: data,
    isLoading: !error && !data,
    isError: error,
    mutatePhoneNumber: mutate,
  };
};

export default usePhoneNumber;
