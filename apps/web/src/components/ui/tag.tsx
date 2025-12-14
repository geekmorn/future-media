import { cn } from "@/lib/utils";

export interface TagProps {
  name: string;
  className?: string;
}

export function Tag({ name, className }: TagProps) {
  return (
    <div
      className={cn(
        "bg-[rgba(151,71,255,0.05)] flex items-center justify-center overflow-hidden px-[14px] py-[4px] rounded-[16px]",
        className
      )}
    >
      <span className="font-medium leading-[16px] text-[#9747ff] text-[12px]">
        {name}
      </span>
    </div>
  );
}
