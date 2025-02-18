/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { PostForm } from "../types/post.types";

export const useEditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<PostForm>({
    title: "",
    content: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/post/${id}`
        );
        setFormData({
          title: response.data.title,
          content: response.data.content,
        });
      } catch (err: any) {
        setError("Failed to fetch post");
      } finally {
        setIsFetching(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      await axios.put(`${import.meta.env.VITE_BASE_URL}/post/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigate(`/post/${id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update post");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    setFormData,
    error,
    isLoading,
    isFetching,
    handleSubmit,
  };
};
