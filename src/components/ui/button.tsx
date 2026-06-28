"use client";

import { Slot } from "@radix-ui/react-slot";
import clsx from "clsx";

type ButtonVariant = "default" | "secondary" | "ghost";
type ButtonSize = "sm" | "md";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  default: "bg-sky-500 text-slate-950 shadow-sm shadow-sky-500/20 hover:bg-sky-400",
  secondary: "bg-white/5 text-slate-100 shadow-sm shadow-white/5 hover:bg-white/10",
  ghost: "bg-transparent text-slate-200 hover:bg-white/10",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-5 py-3 text-sm sm:text-base",
};

const Button = ({
  className,
  variant = "default",
  size = "md",
  asChild = false,
  ...props
}: ButtonProps) => {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      className={clsx(
        "inline-flex items-center justify-center rounded-full font-semibold transition duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:pointer-events-none disabled:opacity-50",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    />
  );
};

export default Button;
