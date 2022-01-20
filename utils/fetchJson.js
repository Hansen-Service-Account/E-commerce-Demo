export default async function fetcher(...args) {
  try {
    console.log(...args);
    const response = await fetch(...args);
    const data = await response.json();

    if (response.ok) {
      return data;
    }

    const error = new Error(response.statusText);
    error.response = response;
    error.data = data;
    throw error;
  } catch (error) {
    if (!error.data) {
      error.data = { error };
    }
    throw error;
  }
}
