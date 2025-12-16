'use client';

import { Button } from './button';
import { CloseIcon } from '@/components/icons';
import { useModal } from '@/hooks/use-modal';

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  variant?: 'danger' | 'primary';
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isLoading = false,
  variant = 'primary',
}: ConfirmModalProps) {
  useModal({ isOpen, onClose, disabled: isLoading });

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isLoading) {
          onClose();
        }
      }}
    >
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 w-full max-w-[400px] bg-[#111] border border-[rgba(255,255,255,0.2)] rounded-[16px]">
        <div className="relative flex items-center justify-center h-[52px] px-4 border-b border-[rgba(255,255,255,0.2)]">
          <h2 className="text-[20px] font-medium leading-[28px] text-white text-center">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-[8px] rounded-[12px] hover:bg-[rgba(255,255,255,0.1)] transition-colors disabled:opacity-50"
            aria-label="Close modal"
          >
            <CloseIcon className="size-6 text-white" />
          </button>
        </div>

        <div className="flex flex-col gap-6 px-4 pt-6 pb-6">
          <p className="text-[14px] leading-[20px] text-[rgba(255,255,255,0.8)] text-center">
            {message}
          </p>

          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={onClose}
              disabled={isLoading}
            >
              {cancelText}
            </Button>
            <Button
              type="button"
              variant={variant}
              size="md"
              onClick={onConfirm}
              isLoading={isLoading}
              disabled={isLoading}
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
