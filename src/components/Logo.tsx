import { cn } from "@/lib/utils";
import logo from "@/assets/logo.png";

export function Logo({ className }: { className?: string }) {
  return (
    <img
      src={logo}
      alt="Preproute"
      className={cn("h-8 w-auto object-contain", className)}
    />
  );
}
