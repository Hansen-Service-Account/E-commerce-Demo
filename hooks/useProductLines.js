import useSWR from "swr";
import { HANSEN_CPQ_V2_BASE_URL } from "../utils/constants";
import fetcher from "../utils/fetchJson";

const useProductLines = () => {
  const { data, error } = useSWR(
    `${HANSEN_CPQ_V2_BASE_URL}/classifications/Selling_Category_Value`,
    fetcher
  );

  return {
    productLines: data,
    isLoading: !error && !data,
    isError: error,
  };
};

export default useProductLines;
