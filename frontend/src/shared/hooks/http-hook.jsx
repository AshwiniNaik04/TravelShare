import { useState, useCallback } from "react";

export const useHttp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const sendRequest = useCallback(
    async (url, method = "GET", body = null, headers = {}) => {
      setIsLoading(true);

      try {
        if (body) {
          body = JSON.stringify(body);
          headers["Content-Type"] = "application/json";
        }

        const response = await fetch(url, {
          method,
          body,
          headers
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Request failed!");
        }

        setIsLoading(false);
        return data;

      } catch (err) {
        setError(err.message || "Something went wrong!");
        setIsLoading(false);
        throw err; // rethrow to handle in component if needed
      }
    },
    []
  );

  const clearError = () => {
    setError(null);
  };

  return { isLoading, error, sendRequest, clearError };
};