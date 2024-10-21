import { Texts } from "@/components";
import { EventProps } from "@/types/event";
import { renderDate } from "@/utils";
import { getRandomColor } from "@/utils/constants";
import { Badge, Card } from "@radix-ui/themes";

type EventCardProps = {
  index: number;
  setOpenCard: (openCard: boolean) => void;
  event: EventProps;
  setActive: (index: number) => void;
};
export default function EventCard({
  setActive,
  index,
  event,
  setOpenCard,
}: EventCardProps) {
  const handleOpenCard = () => {
    setOpenCard(true);
    setActive(index);
  };
  return (
    <Card
      onClick={handleOpenCard}
      className={`hover:opacity-80 hover:transition duration-150 ease-in cursor-pointer border-l-4 h-[150px]`}
      style={{ borderLeftColor: getRandomColor(event.status as string) }}
    >
      <div className="w-full">
        <div className="flex justify-end w-full">
          <Badge
            color={
              event.status === "ongoing"
                ? "jade"
                : event.status === "ended"
                  ? "crimson"
                  : event.status === "cancelled"
                    ? "violet"
                    : event.status === "postponed"
                      ? "yellow"
                      : "indigo"
            }
            size="2"
            className="capitalize"
            variant="soft"
          >
            {event.status}
          </Badge>
        </div>
      </div>
      <div className="mb-4">
        <Texts className="font-semibold capitalize" text={event.title} />
        <Texts className="text-sm text-sky-300" text={renderDate(event)} />
      </div>
      <Texts
        className="text-md text-sky-300"
        text={
          event.description.length > 60
            ? event.description.slice(0, 60) + "..."
            : event.description
        }
      />
    </Card>
  );
}
