import { authService } from "@/api";
import { ActionButton, Headings, RouterLink, Texts } from "@/components";
import FloatingShape from "@/layouts/auth/FloatingShape";
import { useAuthProvider } from "@/store";
import { Userinfo } from "@/types/user";
import { handleError } from "@/utils";
import { Card } from "@radix-ui/themes";
import { useCallback, useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { SiApacheopenoffice } from "react-icons/si";
import { Form, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function VerifyAccount() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";
  const { checkAuth, user } = useAuthProvider() as {
    user: Userinfo;
    checkAuth: () => void;
  };

  useEffect(() => {
    if (user?.isVerified) {
      navigate(from);
    }
  }, [from, navigate, user?.isVerified]);

  const handleChange = (index: number, value: string) => {
    const newCode = [...code];
    if (value.length > 1) {
      const pastedCode = value.slice(0, 6).split("");
      for (let i = 0; i < 6; i++) {
        newCode[i] = pastedCode[i] || "";
      }
      setCode(newCode);
      const lastFilledIndex =
        newCode
          .map((digit, i) => ({ digit, i }))
          .reverse()
          .find(({ digit }) => digit !== "")?.i ?? -1;
      const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
      const focusElement = inputRefs.current[
        focusIndex
      ] as HTMLInputElement | null;
      if (focusElement) {
        focusElement.focus();
      }
    } else {
      newCode[index] = value;
      setCode(newCode);
      if (value && index < 5) {
        const nextInput = inputRefs.current[
          index + 1
        ] as HTMLInputElement | null;
        if (nextInput) {
          nextInput.focus();
        }
      }
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      const previousInput = inputRefs.current[
        index - 1
      ] as HTMLInputElement | null;
      if (previousInput) {
        previousInput.focus();
      }
    }
  };

  const handleSubmit = useCallback(
    async (e: React.KeyboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const verificationCode = code.join("");
      setIsSubmitting(true);
      try {
        const { data } = await authService.verifyUserEmail(verificationCode);
        toast.success(data.msg);
        const timeoutId = setTimeout(() => {
          checkAuth();
        }, 1000);
        navigate("/");
        return () => clearTimeout(timeoutId);
      } catch (error) {
        handleError(error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [code, checkAuth, navigate]
  );

  useEffect(() => {
    if (code.every((digit) => digit !== "")) {
      handleSubmit({
        preventDefault: () => {},
      } as React.KeyboardEvent<HTMLInputElement>);
    }
  }, [code, handleSubmit]);

  return (
    <>
      <Helmet>
        <title>Verify your email to gain access to EMPLY</title>
        <meta name="description" content="Get access to Emply's dashboard" />
      </Helmet>
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
            <Form
              className="w-full p-3"
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(
                  e as unknown as React.KeyboardEvent<HTMLInputElement>
                );
              }}
            >
              <Headings
                className="font-semibold text-2xl text-sky-300 text-center mb-4"
                text="Verify Your Email"
                header={false}
              />
              <Texts
                className="text-md text-sky-300 text-center"
                text="Enter the six digit code sent to your email address"
              />
              <div className="my-6 flex justify-between">
                {code.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el: HTMLInputElement) => {
                      if (el) {
                        inputRefs.current[index] = el;
                      }
                    }}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-12 text-center text-2xl font-bold bg-gray-700 text-white border-2 rounded-lg focus:border-green-500 focus:outline-none"
                  />
                ))}
              </div>
              <ActionButton
                type="submit"
                text="Verify"
                style={{
                  width: "100%",
                  backgroundColor: "var(--sky-300)",
                  color: "white",
                  cursor: "pointer",
                }}
                size="3"
                variant="soft"
                loading={isSubmitting}
                disabled={isSubmitting}
              />
            </Form>
            <Texts text="OR" className="text-center my-2" />
          </Card>
        </div>
      </main>
    </>
  );
}
