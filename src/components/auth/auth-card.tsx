"use client";

import { ReactNode } from "react";
import clsx from "clsx";

interface AuthCardProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export default function AuthCard({ title, subtitle, children, footer, className }: AuthCardProps) {
  return (
    <div
      className={clsx(
        "rounded-[2rem] border border-white/10 bg-slate-950/95 p-6 shadow-[0_40px_120px_-80px_rgba(14,165,233,0.3)] sm:p-10",
        className
      )}
    >
      <div className="space-y-3 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-sky-300/80">{title}</p>
        <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl text-balance">{subtitle}</h1>
      </div>

      <div className="mt-10">{children}</div>

      {footer ? <div className="mt-8">{footer}</div> : null}
    </div>
  );
}
