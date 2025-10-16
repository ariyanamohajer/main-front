import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import { AppLayout, AuthLayout } from "@/layouts";
import { GlobalLayout } from "@/components/common";
import { GuestGuard } from "@/guards";

// Lazy load components
const RegisterPage = lazy(() => import("@/pages/auth/register/RegisterPage"));
const LoginView = lazy(() => import("@/view/auth/login/LoginView"));
const ForgetPassPage = lazy(
  () => import("@/pages/auth/forget-pass/ForgetPassPage")
);
const HomePage = lazy(() => import("@/pages/home/HomePage"));
const AboutUsPage = lazy(() => import("@/pages/about/AboutUsPage"));
const PrivacyPage = lazy(() => import("@/pages/privacy/PrivacyPage"));
const NotFoundPage = lazy(() => import("@/pages/404/404"));
// const ProductsPage = lazy(() => import("@/pages/products/ProductsPage"));
// const ProductDetailPage = lazy(
//   () => import("@/pages/products/ProductDetailPage")
// );
// const SIMMarketplacePage = lazy(() => import("@/pages/sim/SIMMarketplacePage"));
// const SIMMarketPlaceDetailPage = lazy(
//   () => import("@/pages/sim/SIMMarketplaceDetailPage")
// );
// const WalletPage = lazy(() => import("@/pages/wallet/WalletPage"));
// const WalletTransactionsPage = lazy(
//   () => import("@/pages/wallet/WalletTransactionsPage")
// );
// const IncreaseCreditPage = lazy(
//   () => import("@/pages/wallet/IncreaseCreditPage")
// );
// const UserPage = lazy(() => import("@/pages/user/UserPage"));
// const OrderPage = lazy(() => import("@/pages/order/OrderPage"));

export const router = createBrowserRouter([
  {
    path: "/",
    element: <GlobalLayout />, // Global layout with PWA prompt
    children: [
      // Public app layout
      {
        element: <AppLayout />,
        children: [
          {
            index: true,
            element: <HomePage />,
          },
          {
            path: "about",
            element: <AboutUsPage />,
          },
          {
            path: "privacy",
            element: <PrivacyPage />,
          },
        ],
      },

      // Protected routes
      // {
      //   element: (
      //     <AuthGuard>
      //       <AppLayout />
      //     </AuthGuard>
      //   ),
      //   children: [
      //     {
      //       path: "products",
      //       element: <ProductsPage />,
      //       children: [
      //         {
      //           path: "products-sim",
      //           element: <SIMMarketplacePage />,
      //         },
      //       ],
      //     },
      //     {
      //       path: "products/:productName",
      //       element: <ProductDetailPage />,
      //     },
      //     {
      //       path: "sim",
      //       element: <SIMMarketplacePage />,
      //     },
      //     { path: "sim/:productId", element: <SIMMarketPlaceDetailPage /> },
      //     {
      //       path: "wallet",
      //       element: <WalletPage />,
      //     },
      //     {
      //       path: "wallet/transactions",
      //       element: <WalletTransactionsPage />,
      //     },
      //     {
      //       path: "wallet/increase-credit",
      //       element: <IncreaseCreditPage />,
      //     },
      //     {
      //       path: "/user",
      //       element: <UserPage />,
      //     },
      //     {
      //       path: "/order",
      //       element: <OrderPage />,
      //     },
      //     // Add more protected routes here
      //   ],
      // },
      {
        path: "/auth",
        element: (
          <GuestGuard>
            <AuthLayout />
          </GuestGuard>
        ),
        children: [
          {
            path: "login",
            element: <LoginView />,
          },
          {
            path: "register",
            element: <RegisterPage />,
          },
          {
            path: "forget-pass",
            element: <ForgetPassPage />,
          },
        ],
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);
