import { ActionButton, FormInput, Headings } from "@/components";
import { useAuthProvider } from "@/store";
import { inputFields } from "@/utils";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { IoMdArrowDropleftCircle } from "react-icons/io";
import { useFetcher, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function Component() {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const { logout } = useAuthProvider();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (fetcher && fetcher.data && fetcher.data?.status === 200) {
      toast.success(fetcher.data.data.msg as string, {
        id: "change-password-success",
      });
      logout();
    }
  }, [fetcher, logout]);

  const isSubmitting = fetcher.state === "submitting";
  const formFields = ["currentPassword", "newPassword"];

  const onFormSubmit = async (data: object) => {
    fetcher.submit(
      { ...data },
      { method: "post", action: "/settings/change-password" }
    );
  };

  return (
    <>
      <Helmet>
        <title>Change password</title>
        <meta name="description" content="Change user password" />
      </Helmet>
      <IoMdArrowDropleftCircle
        className="text-2xl text-sky-300 cursor-pointer"
        role="button"
        onClick={() => navigate("/settings")}
      />
      <Headings className="my-8" text="Update password" header={true} />
      <div className="py-4 px-2 md:w-[50%] mx-auto">
        <fetcher.Form
          method="post"
          action="/settings/change-password"
          onSubmit={handleSubmit(onFormSubmit)}
        >
          <div className="mb-8">
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
          </div>
          <ActionButton
            type="submit"
            text="Update"
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
        </fetcher.Form>
      </div>
    </>
  );
}

Component.displayName = "ChangePassword";
