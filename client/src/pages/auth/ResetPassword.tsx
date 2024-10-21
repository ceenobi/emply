import { ActionButton, FormInput, Headings } from "@/components";
import { inputFields } from "@/utils/constants";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { useFetcher, useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Define the type for your form data
type FormData = {
  password: string;
  confirmPassword: string;
};

export function Component() {
  const [isVisible, setIsVisible] = useState(false);
  const {
    register,
    handleSubmit: handleSubmitWithFormData,
    formState: { errors },
  } = useForm<FormData>();

  const fetcher = useFetcher();
  const navigate = useNavigate();
  const isSubmitting = fetcher.state === "submitting";

  useEffect(() => {
    if (fetcher && fetcher.data && fetcher.data?.status === 200) {
      toast.success(fetcher.data.data.msg as string, {
        id: "resetpaswword-success",
      });
      navigate("/login");
    }
  }, [navigate, fetcher]);

  const onFormSubmit = async ({
    password,
    confirmPassword,
  }: {
    password: string;
    confirmPassword: string;
  }) => {
    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }
    fetcher.submit({ password, confirmPassword }, { method: "post" });
  };

  return (
    <>
      <Helmet>
        <title>Reset password</title>
        <meta name="description" content="Reset your password" />
      </Helmet>
      <fetcher.Form
        method="post"
        className="w-full p-3"
        onSubmit={handleSubmitWithFormData((data: FormData) => onFormSubmit(data))}
      >
        <Headings
          className="font-semibold text-lg text-sky-300 text-center mb-5"
          text="Reset your password"
          header={false}
        />
        {inputFields
          .filter(
            (item) =>
              item.name === "password" || item.name === "confirmPassword"
          )
          .map(({ type, id, name, label, placeholder, Icon, validate }) => (
            <FormInput
              type={type || undefined}
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
            />
          ))}
        <ActionButton
          type="submit"
          text="Reset"
          style={{
            width: "100%",
            backgroundColor: "var(--sky-300)",
            color: "white",
            cursor: "pointer",
          }}
          size="3"
          variant="solid"
          loading={isSubmitting}
        />
      </fetcher.Form>
    </>
  );
}

Component.displayName = "ResetPassword";
