import { Texts } from "@/components";
import { TaskData } from "@/types/task";
import { renderDate } from "@/utils";
import { getRandomColor } from "@/utils/constants";
import { Avatar, Badge, Card, Separator, Tooltip } from "@radix-ui/themes";
import { CiCirclePlus } from "react-icons/ci";

type Dataprops = {
  data: { data: { tasks: TaskData[] } };
};

export default function InProgress({ data }: Dataprops) {
  const inProgressTasks = data?.data?.tasks.filter(
    (task: TaskData) => task.status === "inprogress"
  );
  return (
    <div className="min-w-full lg:min-w-[300px] mb-6">
      <div className="flex justify-between items-center mb-6">
        <Texts
          text={
            <>
              <span className="mr-3">In progress</span>
              <Badge variant="solid" color="indigo">
                {inProgressTasks?.length}
              </Badge>
            </>
          }
          className="uppercase font-semibold text-sm"
        />
        <CiCirclePlus size="24px" />
      </div>
      {inProgressTasks.length > 0 ? (
        <>
          {inProgressTasks.slice(0, 7).map((task: TaskData) => (
            <div key={task._id} className="mt-6">
              <Card
                className={`hover:opacity-80 hover:transition duration-150 ease-in cursor-pointer border-l-4 shadow-md`}
                style={{ borderLeftColor: getRandomColor(task.status) }}
              >
                <Texts
                  className="font-semibold capitalize"
                  text={
                    task?.title.length > 30
                      ? task.title.slice(0, 30) + "..."
                      : task.title
                  }
                />
                <Separator size="4" className="my-2" />
                <div className="flex justify-between items-center">
                  <Texts
                    className="text-sm text-sky-300"
                    text={renderDate(task)}
                  />
                  <Tooltip
                    content={task?.userId?.firstName.concat(
                      " ",
                      task?.userId?.lastName
                    )}
                  >
                    <Avatar
                      size="2"
                      src={task?.userId?.photo}
                      fallback={task?.userId?.firstName.slice(0, 1) as string}
                    />
                  </Tooltip>
                </div>
              </Card>
            </div>
          ))}
        </>
      ) : (
        <Card
          className={`hover:opacity-80 hover:transition duration-150 ease-in cursor-pointer border-l-4 shadow-md`}
          style={{ borderLeftColor: getRandomColor("red") }}
        >
          <Texts text="There are currently no tasks in progress" />
        </Card>
      )}
    </div>
  );
}
