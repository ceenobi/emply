import { ActionButton, FormInput, FormSelect, Headings } from "@/components";
import { DepartmentsData } from "@/types/dept";
import { gender, jobType, selectJobTitle, validators } from "@/utils";
import { employeeRole, inputFields } from "@/utils";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { useFetcher, useNavigate, useRouteLoaderData } from "react-router-dom";
import { toast } from "sonner";

export default function Register() {
  const [isVisible, setIsVisible] = useState(false);
  const {
    depts: { data },
  } = useRouteLoaderData("departments-employees") as {
    depts: {
      data: {
        departments: DepartmentsData[];
        getDeptNames: string[];
        deptCount: { [key: string]: number };
      };
    };
  };

  const navigate = useNavigate();
  const fetcher = useFetcher();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm();
  const isSubmitting = fetcher.state === "submitting";
  const departments = data?.departments;

  useEffect(() => {
    if (fetcher && fetcher.data && fetcher.data?.status === 201) {
      toast.success(fetcher.data.data.msg as string, {
        id: "register-success",
      });
      navigate("/employees");
    }
  }, [navigate, fetcher]);

  const formFields1 = [
    "email",
    "password",
    "firstName",
    "lastName",
    "dateOfBirth",
    "phone",
  ];

  const onFormSubmit = async (data: object) => {
    fetcher.submit(
      { ...data },
      { method: "post", action: "/employees/register" }
    );
  };

  return (
    <>
      <Helmet>
        <title>Register a new employee to your organization</title>
        <meta
          name="description"
          content="Add a new worker to your organization."
        />
      </Helmet>
      <Headings className="my-8" text="Add a new employee" header={true} />
      <div className="py-4 px-2">
        <fetcher.Form
          method="post"
          action="/employees/register"
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
                label="Gender"
                name="gender"
                id="gender"
                register={register}
                errors={errors}
                placeholder="None selected"
                data={gender}
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
                data={jobType}
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
                control={control}
                isRequired
              />
              <FormSelect
                label="Select department"
                name="dept"
                id="dept"
                register={register}
                errors={errors}
                placeholder="None selected"
                data={departments}
                validate={(value) => validators.validateDepartment(value)}
                control={control}
                isRequired
              />
            </div>
            <div>
              <FormSelect
                label="Employee role"
                name="role"
                id="role"
                register={register}
                errors={errors}
                placeholder="None selected"
                data={employeeRole}
                validate={(value) => validators.validateRole(value)}
                control={control}
                isRequired
              />
            </div>
          </div>
          <div className="mt-8 text-end">
            <ActionButton
              type="submit"
              text="Register"
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
  );
}
