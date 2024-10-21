import {
  ActionButton,
  FormInput,
  FormSelect,
  Headings,
  InfoBox,
  Texts,
} from "@/components";
import { useEditMode } from "@/store";
import { LeaveProps } from "@/types/leave";
import { formatEditDate, renderDate, validators } from "@/utils";
import { Avatar, Badge, Popover, Separator, Tooltip } from "@radix-ui/themes";
import { lazy, Suspense, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { FaEdit, FaRegCalendarAlt } from "react-icons/fa";
import { useFetcher, useNavigate } from "react-router-dom";
import { PiPersonArmsSpread } from "react-icons/pi";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { RiErrorWarningFill } from "react-icons/ri";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import { employeeLeaveType, inputFields } from "@/utils/constants";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { IoImageOutline } from "react-icons/io5";

const SimpleMDE = lazy(() => import("react-simplemde-editor"));

export default function EditLeave({
  leave,
  setOpenCard,
  openCard,
}: {
  leave: LeaveProps;
  setOpenCard: (openCard: boolean) => void;
  openCard: boolean;
}) {
  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    undefined
  );
  const navigate = useNavigate();
  const { isEditMode, setIsEditMode } = useEditMode() as {
    isEditMode: boolean;
    setIsEditMode: (state: boolean) => void;
  };
  const fetcher = useFetcher();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
  } = useForm();

  const {
    description,
    status,
    startDate,
    endDate,
    photo,
    userId,
    leaveType,
    _id,
    isApproved,
  } = leave;
  const leaveTime = { startDate, endDate };
  const isSubmitting = fetcher.state === "submitting";

  useEffect(() => {
    if (fetcher && fetcher.data && fetcher.data?.status === 200) {
      toast.success(fetcher.data.data.msg as string, {
        id: "delete-update-leave-success",
      });
      setOpenCard(false);
      navigate("/leaves");
    }
  }, [navigate, fetcher, setOpenCard]);

  useEffect(() => {
    setValue("status", status);
    setValue("leaveType", leaveType);
    setValue("description", description);
    setValue("startDate", formatEditDate(startDate));
    setValue("endDate", formatEditDate(endDate));
  }, [description, endDate, leaveType, setValue, startDate, status]);

  const deleteLeave = () => {
    fetcher.submit(
      { id: _id as string },
      {
        method: "delete",
        action: "/leaves",
      }
    );
  };

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

  const handleClose = () => {
    if (isEditMode) {
      setIsEditMode(false);
      setOpenCard?.(true);
    } else if (!isEditMode) {
      setOpenCard?.(false);
    }
  };

  const onFormSubmit = (data: object) => {
    fetcher.submit(
      { ...data, id: _id, photo: selectedImage || "" },
      { method: "patch", action: "/leaves" }
    );
  };

  return (
    <InfoBox title="Details" open={openCard} setOpen={setOpenCard}>
      <Helmet>
        <title>Manage your Leave</title>
        <meta name="description" content="Edit and update your leave request" />
      </Helmet>
      {!isEditMode ? (
        <>
          {" "}
          <div className="flex items-center justify-between mb-4">
            <Badge
              color={
                status === "pending"
                  ? "cyan"
                  : status === "approved"
                    ? "jade"
                    : status === "rejected"
                      ? "crimson"
                      : "blue"
              }
              size="2"
              className="capitalize"
              variant="soft"
            >
              {status}
            </Badge>
            <>
              {!isApproved && (
                <Tooltip content="Edit leave">
                  <div>
                    <FaEdit
                      size="18px"
                      onClick={() => setIsEditMode(true)}
                      role="button "
                      className="cursor-pointer"
                    />
                  </div>
                </Tooltip>
              )}
            </>
          </div>
          <div>
            <Texts
              text={
                <>
                  <b>Leave Type: </b>
                  {leaveType}
                </>
              }
              className="capitalize text-sm mb-4"
            />
            <Texts
              text={
                <>
                  <b>Description: </b>
                  {description}
                </>
              }
              className="text-sm mb-4"
            />
            {photo && validators.isValidImage(photo) && (
              <Tooltip content="View image">
                <a href={photo} target="_blank" rel="noopener">
                  <Avatar
                    size="8"
                    src={photo}
                    fallback="A"
                    alt="photo supporting the leave request"
                    radius="full"
                  />
                </a>
              </Tooltip>
            )}
          </div>
          <Separator my="3" size="4" />
          <div className="flex gap-2">
            <FaRegCalendarAlt />
            <div>
              <Texts
                text={renderDate(leaveTime as LeaveProps)}
                className="text-sm font-semibold"
              />
            </div>
          </div>
          <Separator my="3" size="4" />
          <div className="flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <PiPersonArmsSpread />
              <div className="flex gap-1 item-center rounded-2xl bg-cream-200 p-1">
                <Avatar
                  src={userId?.photo}
                  size="1"
                  className="text-tiny"
                  fallback="A"
                  variant="soft"
                />
                <span className="text-[13px] font-medium text-sky-300">
                  {userId?.firstName + " " + userId?.lastName}
                </span>
              </div>
            </div>
            <fetcher.Form method="delete" action="/leaves">
              <Popover.Root>
                <Popover.Trigger>
                  <div>
                    <MdOutlineDeleteOutline
                      role="button"
                      className="cursor-pointer text-red-500"
                      size="18px"
                      title="delete leave"
                    />
                  </div>
                </Popover.Trigger>
                <Popover.Content
                  size="1"
                  maxWidth="200px"
                  side="left"
                  sideOffset={30}
                >
                  <div className="flex gap-1 items-center mb-2">
                    <RiErrorWarningFill color="orange" />
                    <div className="text-tiny">Are you sure?</div>
                  </div>
                  <ActionButton
                    size="1"
                    variant="soft"
                    color="crimson"
                    type="submit"
                    onClick={deleteLeave}
                    disabled={isSubmitting}
                    loading={isSubmitting}
                    text={isSubmitting ? "Deleting" : "Delete"}
                    style={{
                      width: "100%",
                      cursor: "pointer",
                    }}
                  />
                </Popover.Content>
              </Popover.Root>
            </fetcher.Form>
          </div>
          <Separator my="3" size="4" />
        </>
      ) : (
        <>
          <fetcher.Form
            method="patch"
            action="/leaves"
            encType="multipart/form-data"
            onSubmit={handleSubmit(onFormSubmit)}
          >
            <div className="flex w-full justify-between items-center">
              <Texts text="Leave Type:" className="text-sm" />
              <FormSelect
                name="leaveType"
                id="leaveType"
                register={register}
                errors={errors}
                placeholder="None selected"
                data={employeeLeaveType}
                defaultValue={leaveType}
                control={control}
                isRequired
              />
            </div>
            <div>
              <label htmlFor="description" className="text-md my-3">
                Description
              </label>
              <Suspense fallback={<div>Loading editor...</div>}>
                <Controller
                  name="description"
                  control={control}
                  rules={{ required: "Description is required" }}
                  render={({ field }) => (
                    <>
                      <SimpleMDE placeholder="Description" {...field} />
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
            {photo && (
              <div className="flex justify-between items-center">
                <div className="flex relative w-[160px] ">
                  <img
                    alt="Event image peview"
                    src={selectedImage || photo}
                    className="text-center w-[150px] h-[150px] "
                  />
                  {selectedImage && (
                    <IoIosCloseCircleOutline
                      className="absolute top-0 right-0 text-white cursor-pointer hover:text-gray-400 z-10"
                      size="24px"
                      title="delete image"
                      onClick={() => setSelectedImage(undefined)}
                    />
                  )}
                </div>
                <div className="relative bg-dark-100 w-[50%] rounded-lg cursor-pointer">
                  <div className="flex flex-col items-center justify-center w-full h-32 cursor-pointer first-letter:hover:bg-dark-300 ">
                    <IoImageOutline size="30px" />
                    <Headings
                      className="text-md cursor-pointer"
                      text={photo ? "Change image" : "Upload image"}
                      header={false}
                    />
                  </div>
                  <div className="w-full absolute inset-0 opacity-0">
                    <label
                      htmlFor="photo"
                      className="mb-5 text-xs font-semibold"
                    >
                      Upload image
                    </label>
                    <input
                      type="file"
                      className="w-full h-32"
                      accept="image/*"
                      {...register("photo")}
                      onChange={handleImage}
                    />
                  </div>
                </div>
              </div>
            )}
            <div className="mt-4">
              {inputFields
                .filter(
                  (item) => item.name === "startDate" || item.name === "endDate"
                )
                .map(
                  ({ type, id, name, label, placeholder, Icon, validate,  isRequired }) => (
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
                      defaultValue={
                        formatEditDate(startDate || endDate) as string
                      }
                      isRequired={isRequired}
                    />
                  )
                )}
            </div>
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
        </>
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
