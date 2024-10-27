import {
  FormInput,
  FormSelect,
  Headings,
  ActionButton,
  DataSpinner,
} from "@/components";
import { DepartmentsData } from "@/types/dept";
import { Userinfo } from "@/types/user";
import { inputFields, validators } from "@/utils";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import {
  useNavigate,
  useFetcher,
  useLoaderData,
  useRouteLoaderData,
  useParams,
  useNavigation,
} from "react-router-dom";
import { toast } from "sonner";

export default function EditDepartment() {
  const { departmentName } = useParams();
  const { employees } = useRouteLoaderData("departments-employees") as {
    employees: { data: Userinfo[] };
  };
  const { data } = useLoaderData() as { data: DepartmentsData };
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
  const navigation = useNavigation();
  const isSubmitting = fetcher.state === "submitting";
  const formFields = ["name"];
  const formFields1 = ["employeeId"];

  const filterEmployeeNames = employees.data?.map((item: Userinfo) =>
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
      const getEmployee = employees.data.filter((item) =>
        employeeName?.includes(item.firstName.concat(" ", item.lastName))
      );
      const getEmployeeId = getEmployee.map((item) => item.employeeId);
      setValue("employeeId", getEmployeeId);
    }
  }, [employeeName, employees.data, setValue]);

  useEffect(() => {
    if (data) {
      setValue("name", data?.name);
      setValue("employee", data.supervisor);
      setValue("employeeId", data.supervisorEmployeeId);
    }
  }, [data, setValue]);

  useEffect(() => {
    if (fetcher && fetcher.data && fetcher.data?.status === 200) {
      toast.success(fetcher.data.data.msg as string, {
        id: "deptUpdate-success",
      });
      navigate("/departments");
    }
  }, [navigate, fetcher]);

  const onFormSubmit = (formData: object) => {
    fetcher.submit(
      { ...formData, id: data._id },
      { method: "patch", action: `/departments/edit/${departmentName}` }
    );
  };

  return (
    <div>
      <Helmet>
        <title>Edit {departmentName} department</title>
        <meta name="description" content="Update a department information." />
      </Helmet>
      <Headings
        className="my-8"
        text={`Edit ${departmentName} department`}
        header={true}
      />
      {navigation.state === "loading" ? (
        <DataSpinner />
      ) : (
        <div className="max-w-[450px] mx-auto px-2">
          <fetcher.Form
            method="patch"
            action={`/departments/edit/${departmentName}`}
            onSubmit={handleSubmit(onFormSubmit)}
          >
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
              label="Select Supervisor"
              name="employee"
              id="employee"
              register={register}
              errors={errors}
              placeholder="None selected"
              data={employeeNameObjects}
              defaultValue={data.supervisor}
              validate={(value) =>
                validators.validateField(value, "Please select a supervisor")
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
            <div>
              <p className="text-sm text-gray-600 mb-4">
                Note: Selecting a supervisor will automatically set the
                supervisor field in the employee details.
              </p>
              <ActionButton
                type="submit"
                text="Update"
                style={{
                  width: "100%",
                  backgroundColor: "var(--sky-300)",
                  color: "var(--sky-100)",
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
    </div>
  );
}
