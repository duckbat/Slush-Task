/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import axios from "axios";

export const usePostActions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deletePost = async (postId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${import.meta.env.VITE_BASE_URL}/post/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete post");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { deletePost, isLoading, error };
};
