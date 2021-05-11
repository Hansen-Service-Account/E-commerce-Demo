const fetcher = async (...args) => {
  const result = await fetch(...args);
  return result.json();
};

export default fetcher;
