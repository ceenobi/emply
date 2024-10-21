import { ActionButton, FormInput, Headings } from "@/components";
import { inputFields } from "@/utils/constants";
import { useFetcher, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { toast } from "sonner";
export function Component() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const isSubmitting = fetcher.state === "submitting";

  useEffect(() => {
    if (fetcher && fetcher.data && fetcher.data?.status === 200) {
      toast.success(fetcher.data.data.msg as string, {
        id: "forgotpaswword-success",
      });
      navigate("/login");
    }
  }, [navigate, fetcher]);

  const onFormSubmit = async (data: object) => {
    fetcher.submit({ ...data }, { method: "post", action: "/forgot-password" });
  };

  return (
    <fetcher.Form
      method="post"
      className="w-full p-3"
      action="/forgot-password"
      onSubmit={handleSubmit(onFormSubmit)}
    >
      <Headings
        className="font-semibold text-lg text-sky-300 text-center mb-5"
        text=" Enter your email address and we”ll send you a link to reset your
        password"
        header={false}
      />
      {inputFields
        .filter((item) => item.name === "email")
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
          />
        ))}
      <ActionButton
        type="submit"
        text="Send reset link"
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
  );
}

Component.displayName = "ForgotPassword";
