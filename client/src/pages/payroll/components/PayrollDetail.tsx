import { ActionButton, FormSelect, InfoBox } from "@/components";
import { PayrollProps } from "@/types/payroll";
import { payrollStatusColorMap, validators } from "@/utils";
import { Badge, TextArea } from "@radix-ui/themes";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useFetcher, useNavigate } from "react-router-dom";
import { toast } from "sonner";

type PayrollDetailProps = {
  setOpenCard: (isOpen: boolean) => void;
  openCard: boolean;
  selectedEmployee: PayrollProps | null;
};
export default function PayrollDetail({
  selectedEmployee,
  openCard,
  setOpenCard,
}: PayrollDetailProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm();
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const isSubmitting = fetcher.state === "submitting";

  useEffect(() => {
    if (fetcher && fetcher.data && fetcher.data?.status === 200) {
      toast.success(fetcher.data.data.msg as string, {
        id: "payroll-success",
      });
      navigate("/payroll");
    }
    if (fetcher && fetcher.data && fetcher.data?.status !== 200) {
      setOpenCard(false);
    }
  }, [navigate, fetcher, setOpenCard]);

  const handleClose = () => {
    setOpenCard(false);
  };

  const formFields = [
    { _id: "True", name: "true" },
    { _id: "False", name: "false " },
  ];

  const onFormSubmit = (data: object) => {
    if (selectedEmployee !== null) {
      fetcher.submit(
        {
          ...data,
          employeeId: selectedEmployee.employeeId as string,
          firstName: selectedEmployee?.userId?.firstName as string,
          payrollDate: selectedEmployee.payrollDate as string,
        },
        { method: "patch", action: "/payroll" }
      );
    }
  };

  return (
    <InfoBox title="Details" open={openCard} setOpen={setOpenCard}>
      <Badge
        size="3"
        variant="soft"
        color={
          payrollStatusColorMap[
            selectedEmployee?.status as keyof typeof payrollStatusColorMap
          ]
        }
      >
        {selectedEmployee?.status}
      </Badge>
      <div className="mt-4">
        <fetcher.Form
          method="patch"
          action="/payroll"
          encType="multipart/form-data"
          onSubmit={handleSubmit(onFormSubmit)}
        >
          <FormSelect
            label="Toggle payment status"
            name="isPaid"
            id="isPaid"
            register={register}
            errors={errors}
            placeholder="None selected"
            data={formFields}
            validate={(value) =>
              validators.validateField(value, "Please select an option")
            }
            control={control}
            isRequired
          />
          <div className="mb-4">
            <label>Comment</label>
            <TextArea
              placeholder={`send a comment to ${selectedEmployee?.userId?.firstName || "employee"}`}
              size="3"
              mt="2"
              {...register("comment")}
            />
          </div>
          <ActionButton
            type="submit"
            text="Update payment status"
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
      <div className="mt-4 text-end">
        <ActionButton
          type="button"
          text="Cancel"
          size="2"
          variant="soft"
          color="gray"
          style={{ cursor: "pointer" }}
          onClick={handleClose}
        />
      </div>
    </InfoBox>
  );
}
