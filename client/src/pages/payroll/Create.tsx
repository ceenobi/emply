import {
  ActionButton,
  FormInput,
  FormSelect,
  Headings,
} from "@/components";
import { Userinfo } from "@/types/user";
import { inputFields, validators } from "@/utils";
import { TextArea } from "@radix-ui/themes";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { IoMdArrowDropleftCircle } from "react-icons/io";
import { useNavigate, useFetcher, useRouteLoaderData } from "react-router-dom";
import { toast } from "sonner";

export function Component() {
  const { data } = useRouteLoaderData("payrollEmployees") as {
    data: { employees: Userinfo[] };
  };
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
    setValue,
  } = useForm();
  const isSubmitting = fetcher.state === "submitting";

  const formFields1 = ["employeeId", "payrollDate", "salary", "allowance"];
  const formFields2 = ["deductions", "tax", "lateDays", "lwp"];

  const filterEmployeeNames = data?.employees.map((item: Userinfo) =>
    item.firstName.concat(" ", item.lastName)
  );

  const employeeNameObjects =
    filterEmployeeNames?.map((name: string, index: number) => ({
      _id: String(index + 1),
      name: name,
    })) || [];

  const employeeName = watch("employee");

  useEffect(() => {
    if (employeeName) {
      const getEmployee = data.employees.filter((item) =>
        employeeName.includes(item.firstName.concat(" ", item.lastName))
      );
      const getEmployeeId = getEmployee.map((item) => item.employeeId);
      setValue("employeeId", getEmployeeId);
    }
  }, [data.employees, employeeName, setValue]);

  useEffect(() => {
    if (fetcher && fetcher.data && fetcher.data?.status === 201) {
      toast.success(fetcher.data.data.msg as string, {
        id: "payroll-success",
      });
      navigate("/payroll");
    }
  }, [navigate, fetcher]);

  const onFormSubmit = (data: object) => {
    fetcher.submit({ ...data }, { method: "post", action: "/payroll/create" });
  };

  return (
    <>
      <Helmet>
        <title>Add an employee to the payroll</title>
        <meta
          name="description"
          content="Add a new worker to the salary payroll."
        />
      </Helmet>

      <IoMdArrowDropleftCircle
        className="text-2xl text-sky-300 cursor-pointer"
        role="button"
        onClick={() => navigate("/payroll")}
      />
      <Headings className="my-8" text="Add payroll" header={true} />
      <div className="py-4 px-2">
        <fetcher.Form
          method="post"
          action="/payroll/create"
          onSubmit={handleSubmit(onFormSubmit)}
        >
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <FormSelect
                label="Select Employee"
                name="employee"
                id="employee"
                register={register}
                errors={errors}
                placeholder="None selected"
                data={employeeNameObjects}
                validate={(value) =>
                  validators.validateField(value, "Please select an employee")
                }
                control={control}
                isRequired
              />
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
                    />
                  )
                )}
            </div>
            <div>
              <fieldset className="mb-4">
                <label>Comment</label>
                <TextArea
                  placeholder={`send a comment to ${employeeName || "employee"}`}
                  size="3"
                  mt="2"
                  {...register("comment")}
                />
              </fieldset>
            </div>
          </div>
          <div className="mt-8 text-end">
            <ActionButton
              type="submit"
              text="Create"
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

Component.displayName = "CreatePayroll";
