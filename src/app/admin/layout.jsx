import Navbar from "../dashboard/navbar/navbar";
import Sidebar from "../dashboard/sidebar/sidebar";
import Footer from "../dashboard/footer/footer";
import { ToastContainer } from "react-toastify";

const Layout = ({ children }) => {
  return (
    <div className="flex w-full min-h-screen bg-white">
      <div className="flex w-[350px]">
      <ToastContainer />
      <Sidebar />
      </div>
      <div className="flex flex-col w-full flex-grow">
        <Navbar />
        <div className="flex-grow p-4">
          {children}
        </div>
        {/* <Footer /> */}
      </div>
    </div>
  );
};

export default Layout;
