import { ActionButton, InfoBox, RouterLink, Texts } from "@/components";
import { useAuthProvider } from "@/store";
import { TaskData } from "@/types/task";
import { Userinfo } from "@/types/user";
import { renderDate } from "@/utils";
import {
  Avatar,
  Badge,
  Button,
  Popover,
  Separator,
  Tooltip,
} from "@radix-ui/themes";
import { Helmet } from "react-helmet-async";
import { FaEdit, FaRegCalendarAlt } from "react-icons/fa";
import { PiPersonArmsSpread } from "react-icons/pi";
import { useNavigate, useFetcher } from "react-router-dom";
import { TiGroupOutline } from "react-icons/ti";
import { RiErrorWarningFill } from "react-icons/ri";
import { useEffect } from "react";
import { toast } from "sonner";

export default function TaskView({
  task,
  setOpenCard,
  openCard,
}: {
  task: TaskData;
  setOpenCard: (openCard: boolean) => void;
  openCard: boolean;
}) {
  const { user } = useAuthProvider() as { user: Userinfo };
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const {
    title,
    description,
    status,
    startDate,
    endDate,
    userId,
    _id,
    members,
    priority,
    tags,
  } = task;
  const taskTime = { startDate, endDate };
  const isSubmitting = fetcher.state === "submitting";

  useEffect(() => {
    if (fetcher && fetcher.data && fetcher.data?.status === 200) {
      toast.success(fetcher.data.data.msg as string, {
        id: "delete-task-success",
      });
      setOpenCard(false);
      navigate("/tasks");
    }
  }, [navigate, fetcher, setOpenCard]);

  const handleClose = () => {
    setOpenCard?.(false);
  };

  const deleteTask = () => {
    fetcher.submit(
      { id: _id as string },
      {
        method: "delete",
        action: "/tasks",
      }
    );
  };

  return (
    <>
      <InfoBox title="Details" open={openCard} setOpen={setOpenCard}>
        <Helmet>
          <title>Manage your task </title>
          <meta name="description" content="Edit an event" />
        </Helmet>
        <div className="flex items-center justify-between mb-4">
          <Badge
            color={
              status === "planned"
                ? "indigo"
                : status === "inprogress"
                  ? "amber"
                  : status === "completed"
                    ? "violet"
                    : status === "postponed"
                      ? "crimson"
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
              <Tooltip content="Edit task">
                <div>
                  <FaEdit
                    size="18px"
                    onClick={() => navigate(`/tasks/${_id}/edit`)}
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
                <strong className="mr-1">Title:</strong>
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
          <Texts
            text={
              <>
                <b>Priority: </b>
                {priority}
              </>
            }
            className="text-sm mb-4 capitalize"
          />
          <Texts
            text={
              <>
                <b>Tags: </b>
                {tags.map((tag) => (
                  <Badge
                    color="sky"
                    key={tag}
                    className="capitalize mr-2"
                    variant="soft"
                  >
                    {tag}
                  </Badge>
                ))}
              </>
            }
            className="text-sm mb-4 capitalize"
          />
        </div>
        <Separator my="3" size="4" />
        <div className="flex gap-2 mb-4">
          <FaRegCalendarAlt />
          <div>
            <Texts
              text={renderDate(taskTime)}
              className="text-sm font-semibold"
            />
          </div>
        </div>
        <Separator my="3" size="4" />
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2 items-center">
            <PiPersonArmsSpread />
            <div className="flex gap-1 item-center rounded-2xl bg-cream-200 p-1">
              <Avatar
                src={userId?.photo}
                size="1"
                className="text-tiny"
                fallback={userId?.firstName.slice(0, 1) as string}
                variant="soft"
                radius="full"
              />
              <span className="text-[13px] font-medium text-sky-300">
                {userId?.firstName + " " + userId?.lastName}
              </span>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <TiGroupOutline />
            <div className="flex flex-wrap gap-1 item-center rounded-lg p-1">
              <span className="text-[12px] font-semibold">Members:</span>
              {Array.isArray(members) &&
                members.map((member: Userinfo) => (
                  <RouterLink
                    to={`/employees/${member.firstName.toLowerCase()}/${member.employeeId}`}
                    className="hover:opacity-90"
                    key={member._id}
                    text={
                      <Tooltip
                        content={member.firstName.concat(" ", member.lastName)}
                      >
                        <Avatar
                          src={member.photo}
                          size="1"
                          fallback={member?.firstName.slice(0, 1) as string}
                          variant="soft"
                          radius="full"
                        />
                      </Tooltip>
                    }
                  />
                ))}
            </div>
          </div>
        </div>
        <Separator my="3" size="4" />
        <div className="mt-4 flex justify-end items-center gap-4">
          <ActionButton
            type="button"
            text="Cancel"
            size="2"
            variant="soft"
            color="gray"
            style={{ cursor: "pointer" }}
            onClick={handleClose}
          />
          {user._id === userId?._id && (
            <fetcher.Form>
              <Popover.Root>
                <Popover.Trigger>
                  <div>
                    <Button color="red">Delete</Button>
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
                    onClick={deleteTask}
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
      </InfoBox>
    </>
  );
}
