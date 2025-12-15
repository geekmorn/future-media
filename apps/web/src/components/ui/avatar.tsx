import { cn } from "@/lib/utils";

export interface AvatarProps {
  name: string;
  color: string;
  size?: "sm" | "md";
  className?: string;
}

export function Avatar({ name, color, size = "md", className }: AvatarProps) {
  const initial = name.charAt(0).toUpperCase();

  const isLightColor = ["#fbbc05", "#34e7f8"].includes(color.toLowerCase());
  const textColor = isLightColor ? "text-black" : "text-white";

  const sizes = {
    sm: "size-[24px] text-[12px] leading-[16px]",
    md: "size-[32px] text-[14px] leading-[20px]",
  };

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full font-medium",
        sizes[size],
        textColor,
        className
      )}
      style={{ backgroundColor: color }}
    >
      {initial}
    </div>
  );
}
