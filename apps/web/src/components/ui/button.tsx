"use client";

import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "icon";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-[10px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none";

    const variants = {
      primary:
        "bg-[#9747ff] text-white hover:bg-[#8a3dee] active:bg-[#7c34e0] disabled:bg-[#353535] disabled:opacity-60",
      secondary:
        "bg-[#171717] text-white hover:bg-[#222] active:bg-[#2a2a2a] disabled:opacity-50",
      ghost:
        "bg-transparent text-white hover:bg-[rgba(255,255,255,0.1)] active:bg-[rgba(255,255,255,0.15)] disabled:opacity-50",
      icon:
        "bg-[#171717] text-white hover:bg-[#222] active:bg-[#2a2a2a] disabled:opacity-50 rounded-[12px]",
    };

    const sizes = {
      sm: "h-[36px] px-5 text-[14px] leading-[20px]",
      md: "h-[40px] px-6 text-[16px] leading-[24px]",
      lg: "h-[48px] px-6 text-[16px] leading-[24px]",
    };

    // Icon variant has different sizing
    const iconSizes = {
      sm: "size-[36px] p-[8px]",
      md: "size-[48px] p-[12px]",
      lg: "size-[56px] p-[16px]",
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          variant === "icon" ? iconSizes[size] : sizes[size],
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <span className="mr-2">
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </span>
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

