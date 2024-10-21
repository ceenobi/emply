import { Outlet, ScrollRestoration } from "react-router-dom";
import Sidebar from "./Sidebar";
import Nav from "./Nav";
import { useToggleSidebar } from "@/store";
import { motion } from "framer-motion";
export default function RootLayout() {
  const { isOpenSideBar } = useToggleSidebar() as {
    isOpenSideBar: boolean;
  };

  return (
    <main className="w-full flex min-h-dvh">
      <motion.div
        initial={{
          transform: "translateX(-100%)",
        }}
        animate={{
          transform: `translateX(${isOpenSideBar ? 0 : "-5%"})`,
        }}
        transition={{
          duration: 0.3,
          ease: isOpenSideBar ? "easeIn" : "easeOut",
        }}
        className={`bg-sky-100 shadow-md fixed ${isOpenSideBar ? "w-[80px] lg:w-[238px]" : "hidden lg:block"} top-0 h-full z-40`}
      >
        <Sidebar />
      </motion.div>
      <div
        className={`w-full ${isOpenSideBar ? "ml-[80px] lg:ml-[238px]" : "ml-[0px] lg:ml-[70px]"}`}
      >
        <div className="max-w-screen-2xl mx-auto">
          <Nav />
          <Outlet />
        </div>
        <ScrollRestoration
          getKey={(location) => {
            return location.key;
          }}
        />
      </div>
    </main>
  );
}
