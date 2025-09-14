// src/layout/GlobalLayout.tsx
import { Outlet } from "react-router-dom";
import { PWAManager } from "@/components/features/pwa";

export const GlobalLayout = () => {


  return (
    <>
      <Outlet />
      <PWAManager
        autoPrompt={false}
      />
    </>
  );
};
