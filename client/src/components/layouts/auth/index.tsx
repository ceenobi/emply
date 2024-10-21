import { RouterLink } from "@/components/RouterLink";
import { Card } from "@radix-ui/themes";
import { SiApacheopenoffice } from "react-icons/si";
import { Outlet } from "react-router-dom";
import FloatingShape from "./FloatingShape";

export default function AuthLayout() {
  return (
    <main className="max-w-full p-4 relative overflow-hidden bg-slate-400">
      <RouterLink
        to="/"
        className="text-2xl font-bold hidden lg:block px-2"
        text={
          <div className="flex items-center gap-2 text-sky-300">
            <SiApacheopenoffice /> EMPLY
          </div>
        }
      />
      <div className="flex justify-center items-center min-h-dvh ">
        <FloatingShape
          color="bg-sky-100"
          size="w-64 h-64"
          top="-5%"
          left="10%"
          delay={0}
        />
        <FloatingShape
          color="bg-sky-200"
          size="w-48 h-48"
          top="70%"
          left="80%"
          delay={5}
        />
        <FloatingShape
          color="bg-sky-300"
          size="w-32 h-32"
          top="40%"
          left="-10%"
          delay={2}
        />
        <Card
          className="p-4 rounded-lg shadow w-[95%] md:w-[450px] bg-sky-100"
          variant="surface"
        >
          <Outlet />
        </Card>
      </div>
    </main>
  );
}
