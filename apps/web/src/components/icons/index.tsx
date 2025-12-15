import { cn } from '@/lib/utils';

interface IconProps {
  className?: string;
}

export function FilterIcon({ className }: IconProps) {
  return (
    <svg className={cn('size-6', className)} viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 7h18v2H3V7zm3 5h12v2H6v-2zm3 5h6v2H9v-2z" />
    </svg>
  );
}

export function PlusCircleIcon({ className }: IconProps) {
  return (
    <svg className={cn('size-6', className)} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
    </svg>
  );
}

export function CloseIcon({ className }: IconProps) {
  return (
    <svg
      className={cn('size-6', className)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export function ChevronDownIcon({ className }: IconProps) {
  return (
    <svg
      className={cn('size-4', className)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export function ChevronUpIcon({ className }: IconProps) {
  return (
    <svg
      className={cn('size-4', className)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="18 15 12 9 6 15" />
    </svg>
  );
}

export function CheckIcon({ className }: IconProps) {
  return (
    <svg
      className={cn('size-[18px]', className)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export function MoreHorizontalIcon({ className }: IconProps) {
  return (
    <svg className={cn('size-5', className)} viewBox="0 0 24 24" fill="currentColor">
      <circle cx="5" cy="12" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="19" cy="12" r="2" />
    </svg>
  );
}

export function GoogleIcon({ className }: IconProps) {
  return (
    <svg
      className={cn('size-6', className)}
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
  );
}
