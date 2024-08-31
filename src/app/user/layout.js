import { Inter } from "next/font/google";
import "../globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../components/Header";
import Footer from "../components/Footer";



const inter = Inter({ subsets: ["latin"] });

export default function CustomerRootLayout({ children }) {
  return (
    <html lang="en">
    <body className=" bg-white">
      {/* {children} */}
      {/* <UserProvider> */}

      <ToastContainer />

      <Header />

      <div>{children}</div>



      {/* </UserProvider> */}

      {/* <MenuContextProvider>
        <MainLayout>{children}</MainLayout>
      </MenuContextProvider>
       */}
      {/* {
        isAuthenticated ?  <RouterProvider router={router} /> : <RouterProvider router={LoginRoutes} />
      }
          */}

      {/* <Home/> */}
      <Footer/>

      {/* <Addproducts/> */}
    </body>
  </html>
  );
}
