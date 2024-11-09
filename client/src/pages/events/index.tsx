import {
  DataSpinner,
  Headings,
  Page,
  Paginate,
  RouterLink,
  Texts,
} from "@/components";
import { EventData, EventProps } from "@/types/event";
import React, { Suspense, useState } from "react";
import { Helmet } from "react-helmet-async";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { Await, Outlet, useLoaderData, useMatch } from "react-router-dom";
import EventCard from "./components/EventCard";
import EditEvent from "./components/EditEvent";
import { eventStatusColorMap } from "@/utils/constants";
import { Badge } from "@radix-ui/themes";

export function Component() {
  const [active, setActive] = useState(0);
  const [openCard, setOpenCard] = useState(false);
  const [selectQuery, setSelectQuery] = useState<string | undefined>("all");
  const { data } = useLoaderData() as { data: EventData };
  const match = useMatch("/events");

  const handleFilterQuery = (query: string) => {
    setSelectQuery(query);
  };

  return (
    <>
      <Helmet>
        <title>Events</title>
        <meta name="description" content="View all events" />
      </Helmet>
      <Page>
        {match ? (
          <>
            <div className="flex justify-between items-center">
              <Headings text="Events" header={true} />
              <RouterLink
                to="/events/create"
                className="text-md font-semibold text-sky-100"
                text={
                  <button className="flex justify-center items-center gap-2 w-[140px] md:h-[36px] bg-sky-300 rounded-md">
                    <AiOutlinePlusCircle />
                    Create
                  </button>
                }
              />
            </div>
            <div className="mt-6">
              <Suspense fallback={<DataSpinner />}>
                <Await
                  resolve={data}
                  errorElement={
                    <Texts className="mt-8" text="Error loading data" />
                  }
                >
                  {(resolvedData) => (
                    <>
                      {resolvedData.data.events.length > 0 ? (
                        <>
                          <div className="flex flex-wrap gap-3 items-center">
                            {Object.keys(eventStatusColorMap).map((status) => (
                              <Badge
                                key={status}
                                size="3"
                                variant="soft"
                                color={
                                  selectQuery === status
                                    ? eventStatusColorMap[status]
                                    : "gray"
                                }
                                className="cursor-pointer hover:font-semibold capitalize"
                                onClick={() => handleFilterQuery(status)}
                              >
                                {status}
                              </Badge>
                            ))}
                          </div>
                          <div className="grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-8">
                            {resolvedData.data?.events
                              ?.filter((event: EventProps) =>
                                !selectQuery || selectQuery === "all"
                                  ? event
                                  : event.status === selectQuery
                              )
                              .map((event: EventProps, index: number) => (
                                <React.Fragment key={event._id}>
                                  <EventCard
                                    event={event}
                                    setOpenCard={setOpenCard}
                                    setActive={setActive}
                                    index={index}
                                  />
                                  <>
                                    {index === active && (
                                      <EditEvent
                                        event={event}
                                        setOpenCard={setOpenCard}
                                        openCard={openCard}
                                      />
                                    )}
                                  </>
                                </React.Fragment>
                              ))}
                          </div>
                          <Paginate
                            totalPages={resolvedData.data.totalPages}
                            count={resolvedData.data.count}
                          />
                        </>
                      ) : (
                        <Texts
                          className="mt-8"
                          text="There are no employees to display"
                        />
                      )}
                    </>
                  )}
                </Await>
              </Suspense>
            </div>
          </>
        ) : (
          <Outlet />
        )}
      </Page>
    </>
  );
}

Component.displayName = "Events";
