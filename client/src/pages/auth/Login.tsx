import {
  ActionButton,
  FormInput,
  Headings,
  RouterLink,
  Texts,
} from "@/components";
import { useAuthProvider } from "@/store";
import { inputFields } from "@/utils/constants";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm, FieldValues } from "react-hook-form";
import { useLocation, useFetcher, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function Component() {
  const [isVisible, setIsVisible] = useState(false);
  const [remember, setRemember] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from || "/";
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const fetcher = useFetcher();
  const { checkAuth } = useAuthProvider();
  const isSubmitting = fetcher.state === "submitting";

  useEffect(() => {
    if (fetcher.data && fetcher.data?.status === 200) {
      toast.success(fetcher.data.data.msg, { id: "login-success" });
      const timeoutId = setTimeout(() => {
        checkAuth();
      }, 1000);
      if (!fetcher.data.data.user.isVerified) {
        navigate("/verify-account");
      }
      return () => clearTimeout(timeoutId);
    }
  }, [checkAuth, from, fetcher, navigate]);

  useEffect(() => {
    const getEmail = sessionStorage.getItem("emplyLoginEmail");
    const getRemember = sessionStorage.getItem("rememberMe");
    if (getEmail && getRemember) {
      setValue("email", JSON.parse(getEmail));
      setValue("remember", JSON.parse(getRemember));
    }
  }, [setValue]);

  const formFields = ["email", "password"];

  const rememberUser: () => void = () => {
    setRemember((prev: boolean) => !prev);
  };

  const onFormSubmit = async (data: FieldValues) => {
    if (remember) {
      sessionStorage.setItem("emplyLoginEmail", JSON.stringify(data.email));
      sessionStorage.setItem("rememberMe", JSON.stringify(remember));
    }
    fetcher.submit({ ...data }, { method: "post", action: "/login" });
  };

  return (
    <>
      <Helmet>
        <title>Login to EMPLY</title>
        <meta name="description" content="Get access to Emply's dashboard" />
      </Helmet>
      <fetcher.Form
        method="post"
        action="/login"
        className="w-full p-3"
        onSubmit={handleSubmit(onFormSubmit)}
      >
        <Headings
          className="font-semibold text-2xl text-sky-300 text-center mb-3"
          text="Welcome back"
          header={false}
        />
        <Texts
          text="Please enter your details to login."
          className="text-sky-300 text-center mb-3"
        />
        {inputFields
          .filter((item) => formFields.includes(item.name))
          .map(
            ({
              type,
              id,
              name,
              label,
              placeholder,
              Icon,
              validate,
              isRequired,
            }) => (
              <FormInput
                type={type}
                id={id}
                name={name}
                register={register}
                label={label}
                placeholder={placeholder}
                key={id}
                errors={errors}
                Icon={Icon}
                validate={(value) => validate(value) || undefined}
                isVisible={isVisible}
                setIsVisible={setIsVisible}
                isRequired={isRequired}
              />
            )
          )}
        <div className="flex justify-between items-center mb-5">
          <div className="flex gap-2">
            <input
              type="checkbox"
              id="rememberMe"
              value={remember ? "true" : "false"}
              onChange={rememberUser}
              defaultChecked={JSON.parse(
                sessionStorage.getItem("rememberMe") as string
              )}
            />
            <label
              className="font-medium text-sm text-sky-300"
              htmlFor="rememberMe"
            >
              Remember me
            </label>
          </div>
          <RouterLink
            to="/forgot-password"
            className="font-medium text-sm text-sky-300"
            text="Forgot your password?"
          />
        </div>
        <ActionButton
          type="submit"
          text="Log in"
          style={{
            width: "100%",
            backgroundColor: "var(--sky-300)",
            color: "white",
            cursor: "pointer",
          }}
          size="3"
          variant="solid"
          loading={isSubmitting}
          disabled={isSubmitting}
        />
      </fetcher.Form>
    </>
  );
}

Component.displayName = "Login";
