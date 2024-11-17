import {
  ActionButton,
  FormInput,
  FormSelect,
  InfoBox,
  Texts,
} from "@/components";
import { useAuthProvider, useEditMode } from "@/store";
import { EventProps } from "@/types/event";
import { Userinfo } from "@/types/user";
import {
  eventStatus,
  formatEditDate,
  formatTime,
  inputFields,
  renderDate,
  validators,
} from "@/utils";
import { Avatar, Badge, Popover, Separator, Tooltip } from "@radix-ui/themes";
import { lazy, Suspense, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Controller, useForm } from "react-hook-form";
import { FaEdit, FaRegCalendarAlt } from "react-icons/fa";
import { IoMdTime } from "react-icons/io";
import { MdOutlineDeleteOutline, MdOutlineLocationOn } from "react-icons/md";
import { PiPersonArmsSpread } from "react-icons/pi";
import { RiErrorWarningFill } from "react-icons/ri";
import { useFetcher, useNavigate } from "react-router-dom";
import { toast } from "sonner";
const SimpleMDE = lazy(() => import("react-simplemde-editor"));

export default function EditEvent({
  event,
  setOpenCard,
  openCard,
}: {
  event: EventProps;
  setOpenCard: (openCard: boolean) => void;
  openCard: boolean;
}) {
  const navigate = useNavigate();
  const { isEditMode, setIsEditMode } = useEditMode() as {
    isEditMode: boolean;
    setIsEditMode: (state: boolean) => void;
  };
  const fetcher = useFetcher();
  const { user } = useAuthProvider() as { user: Userinfo };
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
  } = useForm();

  const {
    title,
    description,
    status,
    startDate,
    endDate,
    time,
    photo,
    userId,
    location,
    _id,
  } = event;
  const eventTime = { startDate, endDate };
  const isSubmitting = fetcher.state === "submitting";

  useEffect(() => {
    if (fetcher && fetcher.data && fetcher.data?.status === 200) {
      toast.success(fetcher.data.data.msg as string, {
        id: "delete-update-event-success",
      });
      setOpenCard(false);
      navigate("/events");
    }
  }, [navigate, fetcher, setOpenCard]);

  useEffect(() => {
    setValue("status", status);
    setValue("title", title);
    setValue("description", description);
    setValue("time", time);
    setValue("location", location);
    setValue("startDate", formatEditDate(startDate));
    setValue("endDate", formatEditDate(endDate));
  }, [
    description,
    endDate,
    location,
    setValue,
    startDate,
    status,
    time,
    title,
  ]);

  const handleClose = () => {
    if (isEditMode) {
      setIsEditMode(false);
      setOpenCard?.(true);
    } else if (!isEditMode) {
      setOpenCard?.(false);
    }
  };

  const deleteEvent = () => {
    fetcher.submit(
      { id: _id as string },
      {
        method: "delete",
        action: "/events",
      }
    );
  };

  const formFields1 = ["title", "time", "location"];
  const formFields2 = ["startDate", "endDate"];

  const onFormSubmit = (data: object) => {
    fetcher.submit(
      { ...data, id: _id as string },
      { method: "patch", action: "/events" }
    );
  };

  return (
    <InfoBox title="Details" open={openCard} setOpen={setOpenCard}>
      <Helmet>
        <title>Manage your Event {title}</title>
        <meta name="description" content="Edit an event" />
      </Helmet>
      {!isEditMode ? (
        <>
          <div className="flex items-center justify-between mb-4">
            <Badge
              color={
                status === "ongoing"
                  ? "jade"
                  : status === "ended"
                    ? "crimson"
                    : status === "cancelled"
                      ? "violet"
                      : status === "postponed"
                        ? "yellow"
                        : "indigo"
              }
              size="2"
              className="capitalize"
              variant="soft"
            >
              {status}
            </Badge>
            <>
              {user._id === userId?._id && (
                <Tooltip content="Edit event">
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
                  <strong className="mr-1">Event:</strong>
                  {title}
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
                  <img
                    src={photo}
                    alt="photo about the event"
                    className="w-[120px] h-[120px] "
                  />
                </a>
              </Tooltip>
            )}
          </div>
          <Separator my="3" size="4" />
          <div className="flex gap-2 mb-4">
            <FaRegCalendarAlt />
            <div>
              <Texts
                text={renderDate(eventTime as EventProps)}
                className="text-sm font-semibold"
              />
            </div>
          </div>
          <div className="flex gap-2 mb-4">
            <IoMdTime />
            <div>
              <Texts
                text={formatTime(time)}
                className="text-sm font-semibold"
              />
            </div>
          </div>
          {location && (
            <div className="flex gap-2 mb-4">
              <MdOutlineLocationOn />
              <div>
                <Texts text={location} className="text-sm font-semibold" />
              </div>
            </div>
          )}
          <Separator my="3" size="4" />
          <div className="flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <PiPersonArmsSpread />
              <div className="flex gap-1 item-center rounded-lg bg-cream-200 p-1">
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
            {user._id === userId?._id && (
              <fetcher.Form method="delete" action="/events">
                <Popover.Root>
                  <Popover.Trigger>
                    <div>
                      <MdOutlineDeleteOutline
                        role="button"
                        className="cursor-pointer text-red-500"
                        size="18px"
                        title="delete event"
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
                      onClick={deleteEvent}
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
            )}
          </div>
          <Separator my="3" size="4" />
        </>
      ) : (
        <>
          <fetcher.Form
            method="patch"
            action="/events"
            encType="multipart/form-data"
            onSubmit={handleSubmit(onFormSubmit)}
          >
            <div className="flex w-full justify-between items-center">
              <Texts text="Status Update:" className="text-sm" />
              <FormSelect
                name="status"
                id="status"
                register={register}
                errors={errors}
                placeholder="None selected"
                data={eventStatus}
                control={control}
                defaultValue={
                  status === "cancelled" || status === "postponed" ? status : ""
                }
                isRequired={false}
              />
            </div>
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
                    type={type}
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
            <div className="mt-4">
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
