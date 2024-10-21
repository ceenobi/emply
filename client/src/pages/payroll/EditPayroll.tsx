import {
  ActionButton,
  DataSpinner,
  FormInput,
  Headings,
} from "@/components";
import { PayrollProps } from "@/types/payroll";
import { formatEditDate, inputFields } from "@/utils";
import { TextArea } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { IoMdArrowDropleftCircle } from "react-icons/io";
import {
  useNavigate,
  useLoaderData,
  useFetcher,
  useNavigation,
} from "react-router-dom";
import { toast } from "sonner";

export function Component() {
  const [selectedEmployee, setSelectedEmployee] = useState<PayrollProps>();
  const { data } = useLoaderData() as { data: PayrollProps };
  const navigation = useNavigation();
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const isSubmitting = fetcher.state === "submitting";

  const formFields1 = [
    "firstName",
    "lastName",
    "employeeId",
    "salary",
    "allowance",
  ];
  const formFields2 = ["payrollDate", "deductions", "tax", "lateDays", "lwp"];

  useEffect(() => {
    if (data) {
      setSelectedEmployee(data);
    }
  }, [data]);

  useEffect(() => {
    if (selectedEmployee) {
      setValue("firstName", selectedEmployee?.userId?.firstName);
      setValue("lastName", selectedEmployee?.userId?.lastName);
      setValue("salary", selectedEmployee?.salary);
      setValue("employeeId", selectedEmployee?.employeeId);
      setValue("allowance", selectedEmployee?.allowance);
      setValue("tax", selectedEmployee?.tax);
      setValue("deductions", selectedEmployee?.deductions);
      setValue("lateDays", selectedEmployee?.lateDays);
      setValue("lwp", selectedEmployee?.lwp);
      setValue("comment", selectedEmployee?.comment);
      setValue(
        "payrollDate",
        formatEditDate(selectedEmployee?.payrollDate as string)
      );
    }
  }, [selectedEmployee, setValue]);

  useEffect(() => {
    if (fetcher && fetcher.data && fetcher.data?.status === 200) {
      toast.success(fetcher.data.data.msg as string, {
        id: "payroll-success",
      });
      navigate("/payroll");
    }
  }, [navigate, fetcher]);

  const onFormSubmit = (data: object) => {
    fetcher.submit(
      { ...data },
      {
        method: "patch",
        action: `/payroll/${selectedEmployee?.userId?.firstName}/${selectedEmployee?.employeeId}/${selectedEmployee?.payrollDate}`,
      }
    );
  };

  return (
    <>
      <Helmet>
        <title>Edit an employee to the payroll</title>
        <meta name="description" content="Edit a worker salary payroll." />
      </Helmet>
      <IoMdArrowDropleftCircle
        className="text-2xl text-sky-300 cursor-pointer"
        role="button"
        onClick={() => navigate("/payroll")}
      />
      <Headings className="my-8" text="Update payroll" header={true} />
      {navigation.state === "loading" ? (
        <DataSpinner />
      ) : (
        <div className="py-4 px-2">
          <fetcher.Form
            method="post"
            action="/payroll/create/add-payroll"
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
                        disabled={[
                          "firstName",
                          "lastName",
                          "employeeId",
                        ].includes(name)}
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
                    placeholder={`send a comment to ${"employee"}`}
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
        </div>
      )}
    </>
  );
}

Component.displayName = "EditPayroll";
