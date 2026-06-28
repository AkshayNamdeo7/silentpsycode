"use client";

import { LucideIcon } from "lucide-react";
import Button from "@/components/ui/button";

interface OAuthButtonProps {
  label: string;
  icon: LucideIcon;
}

export default function OAuthButton({ label, icon: Icon }: OAuthButtonProps) {
  return (
    <Button variant="secondary" className="w-full gap-3 rounded-full px-5 py-4 text-sm font-semibold sm:text-base">
      <Icon className="h-5 w-5" />
      {label}
    </Button>
  );
}
