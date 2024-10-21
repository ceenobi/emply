import { ActionButton, FormSelect, InfoBox, Texts } from "@/components";
import { LeaveProps } from "@/types/leave";
import { leaveStatusColorMap, renderDate, validators } from "@/utils";
import { approveLeaveOptions } from "@/utils/constants";
import { Badge, Separator, Tooltip } from "@radix-ui/themes";
import { useCallback, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { FaRegCalendarAlt } from "react-icons/fa";
import { useFetcher, useNavigate } from "react-router-dom";
import { toast } from "sonner";

type ActionLeaveProps = {
  setOpenCard: (isOpen: boolean) => void;
  openCard: boolean;
  selectedUser: LeaveProps | null;
};

export default function ActionLeaveData({
  setOpenCard,
  openCard,
  selectedUser,
}: ActionLeaveProps) {
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
        id: "approve-update-leave-success",
      });
      setOpenCard(false);
      navigate("/leaves/all");
    }
  }, [navigate, fetcher, setOpenCard]);

  const getDate = useMemo(
    () => ({
      startDate: selectedUser?.startDate,
      endDate: selectedUser?.endDate,
    }),
    [selectedUser]
  );

  const handleClose = useCallback(() => {
    setOpenCard(false);
  }, [setOpenCard]);

  const onFormSubmit = useCallback(
    (data: object) => {
      if (selectedUser) {
        fetcher.submit(
          { ...data, id: selectedUser._id },
          { method: "patch", action: "/leaves/all" }
        );
      }
    },
    [fetcher, selectedUser]
  );
  
  return (
    <InfoBox title="Details" open={openCard} setOpen={setOpenCard}>
      <Badge
        size="3"
        variant="soft"
        color={
          leaveStatusColorMap[
            selectedUser?.status as keyof typeof leaveStatusColorMap
          ]
        }
      >
        {selectedUser?.status}
      </Badge>
      <Texts
        text={
          <>
            <b>Description: </b>
            {selectedUser?.description}
          </>
        }
        className="text-sm my-4"
      />
      {selectedUser?.photo && (
        <div className="my-4 flex justify-center">
          <Tooltip content="View image">
            <a href={selectedUser?.photo} target="_blank" rel="noopener">
              <img
                src={selectedUser?.photo}
                className="w-[120px] h-[120px] "
                alt="photo supporting the leave request"
              />
            </a>
          </Tooltip>
        </div>
      )}
      <div className="flex gap-2">
        <FaRegCalendarAlt />
        <div>
          <Texts
            text={renderDate(getDate as LeaveProps)}
            className="text-sm font-semibold"
          />
        </div>
      </div>
      <Separator my="3" size="4" />
      {!selectedUser?.isApproved && (
        <fetcher.Form
          method="patch"
          action="/leaves/all"
          encType="multipart/form-data"
          onSubmit={handleSubmit(onFormSubmit)}
        >
          <FormSelect
            label="Update Leave status"
            name="status"
            id="status"
            register={register}
            errors={errors}
            placeholder="None selected"
            data={approveLeaveOptions}
            validate={(value) =>
              validators.validateField(value, "Please approve or reject leave")
            }
            control={control}
            isRequired
          />
          <ActionButton
            type="submit"
            text="Save"
            style={{
              backgroundColor: "var(--sky-300)",
              color: "white",
              cursor: "pointer",
              width: "100%",
            }}
            size="3"
            variant="soft"
            loading={isSubmitting}
            disabled={isSubmitting}
          />
        </fetcher.Form>
      )}
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
