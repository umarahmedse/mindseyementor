import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

export function useLoginQuery(userId) {
  async function fetchSession() {
    const toastID = toast.loading("Fetching User Details");

    try {
      const response = await fetch(`http://localhost:3001/user/${userId}`);

      if (!response.ok) {
        throw new Error("Session Not Found");
      }

      const res = await response.json();
      toast.update(toastID, {
        render: "Logged In Successfully",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      return res;
    } catch (error) {
      if (error.message.includes("Failed to fetch")) {
        toast.update(toastID, {
          render:
            "Failed to connect to the server. Please check your network connection.",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      } else {
        toast.update(toastID, {
          render: "Session Not Found",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      }

      throw error;
    }
  }

  const { data, isLoading, isFetching, error, isError } = useQuery(
    ["session"],
    fetchSession,
    {
      staleTime: Infinity,
      retry: false,
    }
  );
  return {
    data,
    isLoading,
    error,
    isError,
    isFetching,
    isAuthenticated: data?.userId === userId,
  };
}
