import { Inter } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./components/Header";
import Footer from "./components/Footer";



const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "CouponRI",
  description: "Best coupon website",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
    <body className=" bg-white">
      {children}
    </body>
  </html>
  );
}
