import Image from "next/image";

export function SaathLogo({ className = "h-8 w-auto", size = 36 }: { className?: string; size?: number }) {
  return (
    <Image
      src="/saath-logo.png"
      alt="SAATH Logo"
      width={size}
      height={size}
      className={`object-contain shrink-0 ${className}`}
      priority
    />
  );
}
