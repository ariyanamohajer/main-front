// main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/styles/index.css";
import { router } from "@/routes/Routes.tsx";
import { RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/query-client";
import { AuthProvider } from "@/context";
import { Toaster } from "sonner";
import { initPWAInstallListeners } from "@/components/features/pwa/install";

// Initialize PWA install listeners ONCE at app start
initPWAInstallListeners();


import { registerSW } from "virtual:pwa-register";
registerSW({ immediate: true });

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Toaster richColors position="top-center" closeButton expand={false} duration={4000} />
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);
