"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import InputWrapper from "@/components/ui/input-wrapper";
import { toast } from "sonner";
import { useMAuthLogin, useMAuthSignup } from "@/hooks/query/auth-query";
import { useNavigate } from "react-router";
import * as yup from "yup";
import { roleRedirects } from "@/lib/constant";

export const validateSignupPayload = yup.object().shape({
  name: yup
    .string()
    .min(3, "Name must be at least 3 characters long.")
    .required("Name is required."),
  email: yup
    .string()
    .email("Invalid email address.")
    .required("Email is required."),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters long.")
    .required("Password is required."),
});

export const validateLoginPayload = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email address.")
    .required("Email is required."),
  password: yup
    .string()
    .min(1, "Password is required.")
    .required("Password is required."),
});

export function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const authLoginMutation = useMAuthLogin({
    onSuccess: (data, payload) => {
      if (payload.method === "signup") {
        toast.success(
          "Successfully signed up! Please check your email to verify your account."
        );
      }

      const redirectUrl = roleRedirects[data?.data?.data?.role] || "/feed";

      setTimeout(() => navigate(redirectUrl), 1000);
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message || "An unexpected error occurred.";
      setError(message);
      toast.error(message);
    },
  });

  const authSignupMutation = useMAuthSignup({
    onSuccess: () => {
      toast.success("Successfully signed up!");

      setTimeout(() => navigate("/feed"), 1000);
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message || "An unexpected error occurred.";
      setError(message);
      toast.error(message);
    },
  });

  const currentSchema = isSignUp ? validateSignupPayload : validateLoginPayload;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(currentSchema),
    defaultValues: {
      email: "",
      password: "",
      ...(isSignUp && { name: "" }),
    },
  });

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
    reset();
  };

  const onSubmit = (values) => {
    if (isSignUp) {
      authSignupMutation.mutate({ ...values });
    } else {
      authLoginMutation.mutate({ ...values });
    }
  };

  const isLoading =
    authLoginMutation?.isPending || authSignupMutation?.isPending;

  return (
    <div className="w-full max-w-md">
      <div className="text-left mb-8">
        <h1 className="text-3xl font-bold font-lora">
          {isSignUp ? "Create an account" : "Welcome back"}
        </h1>
        <p className="text-muted-foreground">
          {isSignUp
            ? "Enter your details to get started."
            : "Sign in to continue to your account."}
        </p>
      </div>
      <div className="grid gap-6">
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          {isSignUp && (
            <InputWrapper id="name" label="Name" error={errors.name?.message}>
              <Input
                {...register("name")}
                placeholder="Your Name"
                aria-label="Name"
              />
            </InputWrapper>
          )}
          <InputWrapper id="email" label="Email" error={errors.email?.message}>
            <Input
              {...register("email")}
              type="email"
              placeholder="m@example.com"
              aria-label="Email"
            />
          </InputWrapper>
          <InputWrapper
            id="password"
            label="Password"
            error={errors.password?.message}
          >
            <Input
              {...register("password")}
              type="password"
              aria-label="Password"
            />
          </InputWrapper>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
            aria-label={isSignUp ? "Sign Up" : "Log In"}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : isSignUp ? (
              "Sign Up"
            ) : (
              "Log In"
            )}
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          {isSignUp ? "Already have an account?" : "New?"}
          <Button
            variant="link"
            onClick={toggleForm}
            aria-label={isSignUp ? "Log In" : "Sign Up"}
          >
            {isSignUp ? "Log In" : "Sign Up"}
          </Button>
        </div>
      </div>
    </div>
  );
}
