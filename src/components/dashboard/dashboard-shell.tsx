"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import TopNav from "@/components/dashboard/top-nav";
import Sidebar from "@/components/dashboard/sidebar";
import { isSupabaseClientConfigured, supabase } from "@/lib/supabase";
import { setAuthCookie, clearAuthCookie } from "@/lib/supabase/middleware";

interface DashboardShellProps {
  children: React.ReactNode;
}

export default function DashboardShell({ children }: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const { data: listener } = isSupabaseClientConfigured
      ? supabase.auth.onAuthStateChange((_event, session) => {
          if (session) {
            setAuthCookie();
          } else {
            clearAuthCookie();
          }
        })
      : { data: { subscription: { unsubscribe: () => {} } } };

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <div className="border-b border-white/10 bg-slate-950/95 backdrop-blur-xl">
        <TopNav onToggleSidebar={() => setSidebarOpen((open) => !open)} />
      </div>
      <div className="mx-auto grid min-h-[calc(100vh-72px)] max-w-[1600px] grid-cols-1 gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[280px_1fr] lg:gap-8 xl:px-8">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <motion.main
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="space-y-8"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}
