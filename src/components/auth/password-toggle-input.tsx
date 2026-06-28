"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Input from "@/components/ui/input";

interface PasswordToggleInputProps {
  id: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
}

export default function PasswordToggleInput({
  id,
  label,
  value,
  onChange,
  placeholder,
  error,
}: PasswordToggleInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-slate-200" htmlFor={id}>
        {label}
      </label>
      <div className="relative">
        <Input
          id={id}
          type={visible ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
        <button
          type="button"
          onClick={() => setVisible((prev) => !prev)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-200"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>
      {error ? <p className="text-sm text-rose-400">{error}</p> : null}
    </div>
  );
}
