/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import {
  ActionButton,
  DataSpinner,
  FormInput,
  FormSelect,
  Headings,
} from "@/components";
import { DepartmentsData } from "@/types/dept";
import { Userinfo } from "@/types/user";
import {
  employeeStatus,
  inputFields,
  jobType as JobType,
  selectJobTitle,
  formatEditDate,
} from "@/utils";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import {
  useFetcher,
  useLoaderData,
  useNavigate,
  useNavigation,
  useRouteLoaderData,
} from "react-router-dom";
import { toast } from "sonner";
export default function Component() {
  const [isVisible, setIsVisible] = useState(false);
  const {
    data: { user: userProfile },
  } = useLoaderData() as { data: { user: Userinfo } };
  const {
    depts: { data },
  } = useRouteLoaderData("departments-employees") as {
    depts: {
      data: {
        departments: DepartmentsData;
      };
    };
  };
  const navigate = useNavigate();
  const navigation = useNavigation();
  const fetcher = useFetcher();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm();
  const isSubmitting = fetcher.state === "submitting";
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
    employeeId,
  } = userProfile || {};
  const departments = data.departments;

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
      navigate(-1);
    }
  }, [fetcher, navigate]);

  const formFields1 = ["firstName", "lastName", "email", "dateOfBirth"];
  const formFields2 = ["phone"];

  const onFormSubmit = async (data: object) => {
    fetcher.submit(
      {
        ...data,
        employeeId: employeeId as string,
      },
      {
        method: "patch",
        action: `/employees/edit/${firstName}/${employeeId}`,
      }
    );
  };

  return (
    <>
      <Helmet>
        <title>{firstName + "'s"} profile</title>
        <meta name="description" content="Edit account" />
      </Helmet>
      <Headings
        className="my-8"
        text={`Edit ${firstName}'s account`}
        header={true}
      />
      <div className="py-4 px-2">
        {navigation.state === "loading" ? (
          <DataSpinner />
        ) : (
          <fetcher.Form
            method="patch"
            action={`/employees/edit/${firstName}/${employeeId}`}
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
                      />
                    )
                  )}
              </div>
              <div>
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
                />
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
              </div>
              <div>
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
                        disabled
                      />
                    )
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

Component.displayName = "EditEmployee";
