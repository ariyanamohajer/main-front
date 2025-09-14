import { Outlet } from "react-router-dom";
import Header from "./header/Header";
import Footer from "./footer/Footer";

export const AppLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <main>
        <Header />
          <Outlet />
          <Footer />
        </main>
    </div>
  );
};
