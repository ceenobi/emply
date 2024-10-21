import { Texts } from "@/components";
import { LeaveProps } from "@/types/leave";
import { renderDate } from "@/utils";
import { getRandomColor } from "@/utils/constants";
import { Badge, Card } from "@radix-ui/themes";

type LeaveCardProps = {
  index: number;
  setOpenCard: (openCard: boolean) => void;
  leave: LeaveProps;
  setActive: (index: number) => void;
};
export default function LeaveCard({
  setActive,
  index,
  leave,
  setOpenCard,
}: LeaveCardProps) {
  const handleOpenCard = () => {
    setOpenCard(true);
    setActive(index);
  };

  return (
    <Card
      onClick={handleOpenCard}
      className={`hover:opacity-80 hover:transition duration-150 ease-in cursor-pointer border-l-4 h-[150px]`}
      style={{ borderLeftColor: getRandomColor(leave._id) }}
    >
      <div className="w-full">
        <div className="flex justify-end w-full">
          <Badge
            color={
              leave.status === "pending"
                ? "cyan"
                : leave.status === "approved"
                  ? "jade"
                  : leave.status === "rejected"
                    ? "crimson"
                    : "blue"
            }
            size="2"
            className="capitalize"
            variant="soft"
          >
            {leave.status}
          </Badge>
        </div>
        <div className="mb-4">
          <Texts
            className="capitalize text-sky-300 font-semibold"
            text={leave.leaveType}
          />
          <Texts className="text-sm text-sky-300" text={renderDate(leave)} />
        </div>
        <Texts
          className="text-md text-sky-300"
          text={
            leave.description.length > 60
              ? leave.description.slice(0, 60) + "..."
              : leave.description
          }
        />
      </div>
    </Card>
  );
}
