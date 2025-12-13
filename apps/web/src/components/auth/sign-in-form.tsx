"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn } from "@/lib/api/auth";

interface SignInFormData {
  name: string;
  password: string;
}

interface FormErrors {
  name?: string;
  password?: string;
  general?: string;
}

export function SignInForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<SignInFormData>({
    name: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const result = await signIn({
        name: formData.name.trim(),
        password: formData.password,
      });

      if (result.success) {
        router.push("/");
      } else {
        setErrors({
          general: result.error || "Failed to sign in. Please try again.",
        });
      }
    } catch (error) {
      setErrors({
        general: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof SignInFormData) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    };
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8 w-full">
      {errors.general && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-[8px] px-4 py-3">
          <p className="text-[14px] leading-[20px] text-red-500">
            {errors.general}
          </p>
        </div>
      )}

      <div className="flex flex-col gap-[14px]">
        <Input
          label="Name"
          type="text"
          placeholder="Enter your name"
          value={formData.name}
          onChange={handleChange("name")}
          error={errors.name}
          disabled={isLoading}
          autoComplete="username"
        />

        <Input
          label="Password"
          type="password"
          placeholder="enter your password"
          value={formData.password}
          onChange={handleChange("password")}
          error={errors.password}
          showPasswordToggle
          disabled={isLoading}
          autoComplete="current-password"
        />
      </div>

      <Button type="submit" isLoading={isLoading} className="w-full">
        Sign in
      </Button>

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-6">
          <div className="flex-1 h-px bg-[rgba(255,255,255,0.1)]" />
          <span className="text-[14px] font-medium leading-[20px] text-[rgba(255,255,255,0.8)] whitespace-nowrap">
            or
          </span>
          <div className="flex-1 h-px bg-[rgba(255,255,255,0.1)]" />
        </div>

        <Button
          type="button"
          variant="secondary"
          className="w-full relative"
          disabled={isLoading}
        >
          <svg
            className="absolute left-4 w-6 h-6"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-.97 2.53-2.05 3.31v2.77h3.32c1.94-1.79 3.07-4.43 3.07-7.59z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.78 0 5.12-.92 6.82-2.5l-3.32-2.77c-.93.62-2.12.99-3.5.99-2.69 0-4.97-1.82-5.78-4.27H2.78v2.84C4.47 20.72 7.96 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M6.22 14.45c-.21-.62-.33-1.28-.33-1.95s.12-1.33.33-1.95V7.71H2.78A10.97 10.97 0 0 0 1 12.5c0 1.78.43 3.46 1.18 4.95l3.44-2.84-.4-.16z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.28c1.52 0 2.88.52 3.95 1.55l2.96-2.96C17.1 2.06 14.77 1 12 1 7.96 1 4.47 3.28 2.78 6.71l3.44 2.84c.81-2.45 3.09-4.27 5.78-4.27z"
              fill="#EA4335"
            />
          </svg>
          Sign in with Google
        </Button>
      </div>

    </form>
  );
}

