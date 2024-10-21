import { ActionButton, FormInput, FormSelect, Headings } from "@/components";
import { inputFields, validators } from "@/utils";
import { employeeLeaveType } from "@/utils/constants";
import { lazy, Suspense, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Controller, useForm } from "react-hook-form";
import {
  IoIosCloseCircleOutline,
  IoMdArrowDropleftCircle,
} from "react-icons/io";
import { IoImageOutline } from "react-icons/io5";
import { useNavigate, useFetcher } from "react-router-dom";
import { toast } from "sonner";

const SimpleMDE = lazy(() => import("react-simplemde-editor"));

export function Component() {
  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    undefined
  );
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm();
  const isSubmitting = fetcher.state === "submitting";

  useEffect(() => {
    if (fetcher && fetcher.data && fetcher.data?.status === 201) {
      toast.success(fetcher.data.data.msg as string, {
        id: "leave-apply-success",
      });
      navigate("/leaves");
    }
  }, [navigate, fetcher]);

  const formFields1 = ["startDate", "endDate"];

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size > 2 * 1000 * 1000) {
      toast.error("File with maximum size of 2MB is allowed");
      return false;
    }
    const reader = new FileReader();
    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
    }
  };

  const onFormSubmit = async (data: object) => {
    fetcher.submit(
      { ...data, photo: selectedImage || "" },
      { method: "post", action: "/leaves/apply" }
    );
  };

  return (
    <>
      <Helmet>
        <title>Apply for leave. Set date, time and location. </title>
        <meta
          name="description"
          content="Apply for leave, set date, time and location."
        />
      </Helmet>
      <>
        <IoMdArrowDropleftCircle
          className="text-2xl text-sky-300 cursor-pointer"
          role="button"
          onClick={() => navigate(-1)}
        />
        <Headings text="Apply for leave" header={true} className="my-8" />
        <div className="py-4 px-2">
          <fetcher.Form
            method="post"
            action="/leaves/apply"
            className="w-full"
            encType="multipart/form-data"
            onSubmit={handleSubmit(onFormSubmit)}
          >
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                {inputFields
                  .filter((item) => formFields1.includes(item.name))
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
                        isRequired={isRequired}
                      />
                    )
                  )}
                <FormSelect
                  label="Leave type"
                  name="leaveType"
                  id="leaveType"
                  register={register}
                  errors={errors}
                  placeholder="None selected"
                  data={employeeLeaveType}
                  validate={(value) =>
                    validators.validateField(
                      value,
                      "Please select a leave type"
                    )
                  }
                  control={control}
                  isRequired
                />
              </div>
              <div>
                <div className="flex flex-col gap-3">
                  <label htmlFor="description">Description</label>
                  <Suspense fallback={<div>Loading editor...</div>}>
                    <Controller
                      name="description"
                      control={control}
                      rules={{ required: "Description is required" }}
                      render={({ field }) => (
                        <>
                          <SimpleMDE
                            placeholder="Reason for leave"
                            {...field}
                          />
                          {errors?.description && (
                            <span className="text-xs text-red-600">
                              {errors?.description?.message as string}
                            </span>
                          )}
                        </>
                      )}
                    />
                  </Suspense>
                </div>
              </div>
              <div>
                <div>
                  <p className="mb-4 text-xs font-semibold">
                    Document is required for sick leave to be approved
                    <span className="text-red-600 text-start">*</span>
                  </p>
                  <div className="mt-4 flex flex-col justify-center items-center">
                    <div className="rounded-lg px-4 py-5 w-full cursor-pointer bg-sky-100 hover:transition duration-150 ease-out">
                      {selectedImage ? (
                        <div className="flex justify-center relative">
                          <img
                            alt="Event image peview"
                            src={selectedImage}
                            className="text-center w-[100px] h-[100px]"
                          />
                          <IoIosCloseCircleOutline
                            className="absolute top-0 right-4 text-sky-300 cursor-pointer hover:text-red-400"
                            size="24px"
                            title="delete image"
                            onClick={() => setSelectedImage(undefined)}
                          />
                        </div>
                      ) : (
                        <div className="relative">
                          <div className="flex flex-col items-center justify-center w-full bg-sky-100 h-[100px]">
                            <IoImageOutline size="30px" />
                            <Headings
                              className="text-md cursor-pointer"
                              text={
                                selectedImage ? "Change image" : "Upload image"
                              }
                              header={false}
                            />
                          </div>
                          <div className="w-full absolute inset-0 h-[100px] opacity-0">
                            <label
                              htmlFor="photo"
                              className="mb-5 text-xs font-semibold"
                            >
                              Upload image
                            </label>
                            <input
                              type="file"
                              className="w-full h-[100px]"
                              accept="image/*"
                              {...register("photo")}
                              onChange={handleImage}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    <span className="text-sm">
                      File with maximum size of 2MB is allowed
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8 text-end">
              <ActionButton
                type="submit"
                text="Apply"
                style={{
                  width: "25%",
                  backgroundColor: "var(--sky-300)",
                  color: "white",
                  cursor: "pointer",
                }}
                size="3"
                variant="soft"
                loading={isSubmitting}
                disabled={isSubmitting}
              />
            </div>
          </fetcher.Form>
        </div>
      </>
    </>
  );
}

Component.displayName = "ApplyLeave";
