import {
  ActionButton,
  DataSpinner,
  FormInput,
  FormSelect,
  Headings,
} from "@/components";
import { useAuthProvider } from "@/store";
import { DepartmentsData } from "@/types/dept";
import { Userinfo } from "@/types/user";
import {
  employeeStatus,
  inputFields,
  jobType as JobType,
  selectJobTitle,
  maritalStatus as MaritalStatus,
  formatEditDate,
} from "@/utils";
import { TextArea } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { IoImageOutline } from "react-icons/io5";
import {
  useFetcher,
  useLoaderData,
  useNavigate,
  useNavigation,
  useParams,
  useRouteLoaderData,
} from "react-router-dom";
import { toast } from "sonner";

export function Component() {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    undefined
  );
  const { firstName: firstname, employeeId } = useParams();
  const {
    data: { user: userProfile },
  } = useLoaderData() as { data: { user: Userinfo } };
  const navigate = useNavigate();
  const navigation = useNavigation();
  const { user, checkAuth } = useAuthProvider() as {
    user: Userinfo;
    checkAuth: () => void;
  };
  const {
    depts: { data },
  } = useRouteLoaderData("departments-employees") as {
    depts: {
      data: {
        departments: DepartmentsData;
        getDeptNames: string[];
        deptCount: { [key: string]: number };
      };
    };
  };
  const fetcher = useFetcher();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm();
  const isSubmitting = fetcher.state === "submitting";
  const departments = data.departments;
  const {
    email,
    firstName,
    lastName,
    dept,
    phone,
    photo,
    jobTitle,
    bio,
    address,
    status,
    jobType,
    gender,
    maritalStatus,
    dateOfBirth,
  } = userProfile || {};

  useEffect(() => {
    if (userProfile) {
      setValue("email", email);
      setValue("firstName", firstName);
      setValue("lastName", lastName);
      setValue("dept", dept);
      setValue("phone", phone);
      setValue("photo", photo);
      setValue("jobTitle", jobTitle);
      setValue("status", status);
      setValue("bio", bio);
      setValue("jobType", jobType);
      setValue("gender", gender);
      setValue("maritalStatus", maritalStatus);
      setValue("dateOfBirth", formatEditDate(dateOfBirth as string));
      setValue("homeAddress", address?.homeAddress);
      setValue("state", address?.state);
      setValue("country", address?.country);
    }
  }, [
    address?.country,
    address?.homeAddress,
    address?.state,
    bio,
    dept,
    email,
    firstName,
    jobTitle,
    lastName,
    phone,
    photo,
    status,
    setValue,
    userProfile,
    jobType,
    gender,
    maritalStatus,
    dateOfBirth,
  ]);

  useEffect(() => {
    if (fetcher && fetcher.data && fetcher.data?.status === 200) {
      toast.success(fetcher.data.data.msg as string, {
        id: "update-profile-success",
      });
      const timeoutId = setTimeout(() => {
        checkAuth();
      }, 1000);
      navigate(-1);
      return () => clearTimeout(timeoutId);
    }
  }, [fetcher, checkAuth, navigate, firstName, employeeId]);

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

  const formFields1 = ["email", "firstName", "lastName", "dateOfBirth"];
  const formFields2 = ["phone", "homeAddress", "state", "country"];

  const onFormSubmit = async (data: object) => {
    fetcher.submit(
      { ...data, photo: selectedImage || "", employeeId: employeeId as string },
      {
        method: "patch",
        action: `/settings/profile/${firstname}/${employeeId}`,
      }
    );
  };

  return (
    <>
      <Helmet>
        <title>{firstName + " " + lastName} profile</title>
        <meta name="description" content="Edit account" />
      </Helmet>
      <Headings className="my-8" text="Edit account" header={true} />
      <div className="py-4 px-2">
        {navigation.state === "loading" ? (
          <DataSpinner />
        ) : (
          <fetcher.Form
            method="patch"
            action="/settings/profile"
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
                        isVisible={isVisible}
                        setIsVisible={setIsVisible}
                        isRequired={isRequired}
                        disabled={!["admin", "super-admin"].includes(user.role)}
                      />
                    )
                  )}
                <FormSelect
                  label="Department"
                  name="dept"
                  id="dept"
                  register={register}
                  errors={errors}
                  placeholder="None selected"
                  data={departments}
                  defaultValue={dept}
                  control={control}
                  disabled={!["admin", "super-admin"].includes(user.role)}
                  isRequired
                />
                <FormSelect
                  label="Job Title"
                  name="jobTitle"
                  id="dept"
                  register={register}
                  errors={errors}
                  placeholder="None selected"
                  data={selectJobTitle}
                  defaultValue={jobTitle}
                  control={control}
                  isRequired
                  disabled={!["admin", "super-admin"].includes(user.role)}
                />
              </div>
              <div>
                <FormSelect
                  label="Job Type"
                  name="jobType"
                  id="jobType"
                  register={register}
                  errors={errors}
                  placeholder="None selected"
                  data={JobType}
                  defaultValue={jobType}
                  control={control}
                  isRequired
                  disabled={!["admin", "super-admin"].includes(user.role)}
                />
                <FormSelect
                  label="Status"
                  name="status"
                  id="status"
                  register={register}
                  errors={errors}
                  placeholder="None selected"
                  data={employeeStatus}
                  defaultValue={status}
                  control={control}
                  isRequired
                />

                {inputFields
                  .filter((item) => formFields2.includes(item.name))
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
              </div>
              <div>
                <FormSelect
                  label="Marital Status"
                  name="maritalStatus"
                  id="maritalStatus"
                  register={register}
                  errors={errors}
                  placeholder="None selected"
                  data={MaritalStatus}
                  defaultValue={maritalStatus}
                  control={control}
                  isRequired={false}
                />
                <fieldset className="mb-4">
                  <label className="mb-4">Bio</label>
                  <TextArea
                    placeholder="tell us about yourself"
                    size="3"
                    mt="3"
                    defaultValue={bio}
                    {...register("bio")}
                    disabled={employeeId !== user.employeeId}
                  />
                </fieldset>
                {employeeId === user.employeeId && (
                  <div className="flex flex-col justify-center mb-8">
                    <label className="mb-4">Profile Photo</label>
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
                              disabled={["admin", "super-admin"].includes(
                                user.role
                              )}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    <span className="text-sm">
                      File with maximum size of 2MB is allowed
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-8 text-end">
              <ActionButton
                type="submit"
                text="Update"
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
        )}
      </div>
    </>
  );
}

Component.displayName = "EditProfile";
