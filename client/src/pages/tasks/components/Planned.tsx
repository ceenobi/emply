import { RouterLink, Texts } from "@/components";
import { TaskData } from "@/types/task";
import { renderDate } from "@/utils";
import { getRandomColor } from "@/utils/constants";
import { Avatar, Badge, Card, Separator, Tooltip } from "@radix-ui/themes";
import { useState } from "react";
import { CiCirclePlus } from "react-icons/ci";
import TaskView from "./TaskView";

type Dataprops = {
  data: { data: { tasks: TaskData[] } };
};

export default function Planned({ data }: Dataprops) {
  const [active, setActive] = useState(0);
  const [openCard, setOpenCard] = useState(false);
  console.log(data);

  const plannedTasks = data?.data?.tasks.filter(
    (task: TaskData) => task.status === "planned"
  );
  const handleOpenCard = (index: number) => {
    setOpenCard(true);
    setActive(index);
  };

  return (
    <div className="min-w-full mb-6">
      <div className="flex justify-between items-center mb-6">
        <Texts
          text={
            <>
              <span className="mr-3">Planned</span>
              <Badge variant="solid" color="indigo">
                {plannedTasks?.length}
              </Badge>
            </>
          }
          className="uppercase font-semibold text-sm"
        />
        <RouterLink text={<CiCirclePlus size="24px" />} to="/tasks/planned"  className="" />
      </div>
      {plannedTasks.length > 0 ? (
        <>
          {plannedTasks.slice(0, 7).map((task: TaskData, index: number) => (
            <div key={task._id} className="mt-6">
              <Card
                className={`hover:opacity-80 hover:transition duration-150 ease-in cursor-pointer border-l-4 shadow-md`}
                style={{ borderLeftColor: getRandomColor(task.status) }}
                onClick={() => handleOpenCard(index)}
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
                    className="text-[12px] text-sky-300"
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
              {index === active && (
                <TaskView
                  task={task}
                  setOpenCard={setOpenCard}
                  openCard={openCard}
                />
              )}
            </div>
          ))}
        </>
      ) : (
        <Card
          className={`hover:opacity-80 hover:transition duration-150 ease-in cursor-pointer border-l-4 shadow-md`}
          style={{ borderLeftColor: getRandomColor("red") }}
        >
          <Texts text="There are no planned tasks yet" className="text-sm" />
        </Card>
      )}
    </div>
  );
}
