/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { RegisterForm, ValidationErrors } from "../types/auth.types";

export const useRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterForm>({
    username: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [submitError, setSubmitError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = async (): Promise<boolean> => {
    const newErrors: ValidationErrors = {};

    if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    } else {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/user/username/${formData.username}`
        );
        if (!response.data.available) {
          newErrors.username = "Username is already taken";
        }
      } catch (error) {
        newErrors.username = "Error checking username availability";
      }
    }

    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = "Please enter a valid email address";
    } else {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/user/email/${formData.email}`
        );
        if (!response.data.available) {
          newErrors.email = "Email is already registered";
        }
      } catch (error) {
        newErrors.email = "Error checking email availability";
      }
    }

    if (formData.password.length < 5) {
      newErrors.password = "Password must be at least 5 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSubmitError("");

    try {
      const isValid = await validateForm();
      if (!isValid) {
        setIsLoading(false);
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/user`,
        formData
      );

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        navigate("/login");
      }
    } catch (error: any) {
      setSubmitError(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    setFormData,
    errors,
    submitError,
    isLoading,
    handleSubmit,
  };
};
