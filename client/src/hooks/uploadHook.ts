/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { PostForm } from "../types/post.types";

export const useUpload = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<PostForm>({
    title: "",
    content: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      await axios.post(`${import.meta.env.VITE_BASE_URL}/post`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create post");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    setFormData,
    error,
    isLoading,
    handleSubmit,
  };
};
