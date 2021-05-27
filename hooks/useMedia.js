import useSWR from "swr";
import { CONTENTFUL_BASE_URL } from "../utils/constants";
import fetcher from "../utils/fetcJson";

const usePageEntry = (entryId) => {
  const { data, error } = useSWR(
    `${CONTENTFUL_BASE_URL}/spaces/${process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID}/environments/master/entries/${entryId}?access_token=${process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN}`,
    fetcher
  );

  return {
    pageEntry: data,
    isLoading: !error && !data,
    isError: error,
  };
};

export default usePageEntry;
