import { useState } from "react";

type Method =
  | "GET"
  | "POST"
  | "PUT"
  | "DELETE";

const useRequest = <T,>() => {
  const [data, setData] =
    useState<T | null>(null);

  const [loading, setLoading] =
    useState<boolean>(false);

  const [error, setError] =
    useState<string | null>(null);

  const apiCall = async (
    url: string,
    method: Method = "GET",
    body: any = null,
    headers: HeadersInit = {}
  ): Promise<any> => {
    try {
      setLoading(true);

      setError(null);

      // Get token from localStorage
      const token =
        localStorage.getItem("token");

      const response = await fetch(
        url,
        {
          method,

          headers: {
            "Content-Type":
              "application/json",

            // Send token automatically
            ...(token && {
              Authorization: `Bearer ${token}`,
            }),

            ...headers,
          },

          body: body
            ? JSON.stringify(body)
            : null,
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "API request failed"
        );
      }

      setData(result);

      return result;
    } catch (err: any) {
      setError(err.message);

      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    error,
    apiCall,
  };
};

export default useRequest;