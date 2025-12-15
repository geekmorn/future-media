'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GoogleIcon } from '@/components/icons';
import { useAuth } from '@/lib/auth';

interface SignUpFormData {
  name: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  name?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

export function SignUpForm() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [formData, setFormData] = useState<SignUpFormData>({
    name: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
      const result = await signUp(formData.name.trim(), formData.password);

      if (result.success) {
        router.push('/');
      } else {
        setErrors({
          general: result.error || 'Failed to sign up. Please try again.',
        });
      }
    } catch {
      setErrors({
        general: 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof SignUpFormData) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    };
  };

  const handleGoogleSignUp = () => {
    router.push('/api/auth/google');
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8 w-full">
      {errors.general && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-[8px] px-4 py-3">
          <p className="text-[14px] leading-[20px] text-red-500">{errors.general}</p>
        </div>
      )}

      <div className="flex flex-col gap-[14px]">
        <Input
          label="Name"
          type="text"
          placeholder="Enter your name"
          value={formData.name}
          onChange={handleChange('name')}
          error={errors.name}
          disabled={isLoading}
          autoComplete="name"
        />

        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange('password')}
          error={errors.password}
          showPasswordToggle
          disabled={isLoading}
          autoComplete="new-password"
        />

        <Input
          label="Confirm password"
          type="password"
          placeholder="Confirm you password"
          value={formData.confirmPassword}
          onChange={handleChange('confirmPassword')}
          error={errors.confirmPassword}
          showPasswordToggle
          disabled={isLoading}
          autoComplete="new-password"
        />
      </div>

      <Button type="submit" isLoading={isLoading} className="w-full">
        Join abroad
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
          onClick={handleGoogleSignUp}
        >
          <GoogleIcon className="absolute left-4" />
          Sign up with Google
        </Button>
      </div>
    </form>
  );
}
