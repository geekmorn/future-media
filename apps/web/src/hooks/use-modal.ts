"use client";

import { useEffect, useCallback } from "react";

export interface UseModalOptions {
  isOpen: boolean;
  onClose: () => void;
  disabled?: boolean;
}

export function useModal({ isOpen, onClose, disabled = false }: UseModalOptions) {
  const handleClose = useCallback(() => {
    if (!disabled) {
      onClose();
    }
  }, [disabled, onClose]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !disabled) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose, disabled]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return { handleClose };
}

