import { DataSpinner, Headings, Paginate, Texts } from "@/components";
import { EventData, EventProps } from "@/types/event";
import React, { Suspense, useState } from "react";
import { Helmet } from "react-helmet-async";
import { IoMdArrowDropleftCircle } from "react-icons/io";
import {
  Await,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import EventCard from "./components/EventCard";
import EditEvent from "./components/EditEvent";

export function Component() {
  const [active, setActive] = useState(0);
  const [openCard, setOpenCard] = useState(false);
  const { data } = useLoaderData() as { data: EventData };

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  //const params = useMemo(
  //() => new URLSearchParams(searchParams),
  //[searchParams]
  //);
  const query = (searchParams.get("query") as string) || "";

  return (
    <>
      <Helmet>
        <title>Search results for &quot;{query}&quot;</title>
        <meta name="description" content="View your search query" />
      </Helmet>
      <IoMdArrowDropleftCircle
        className="text-2xl text-sky-300 cursor-pointer"
        role="button"
        onClick={() => navigate("/events")}
      />
      <div className="mt-6 flex justify-between items-center">
        <Headings text={`Search results for: "${query}"`} header={true} />
      </div>
      <div className="mt-6">
        <Suspense fallback={<DataSpinner />}>
          <Await
            resolve={data}
            errorElement={<Texts className="mt-8" text="Error loading data" />}
          >
            {(resolvedData) => (
              <>
                {resolvedData.data.events?.length > 0 ? (
                  <>
                    <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
                      {resolvedData.data?.events.map(
                        (event: EventProps, index: number) => (
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
                        )
                      )}
                    </div>
                    <Paginate
                      totalPages={resolvedData.data.totalPages}
                      count={resolvedData.data.count}
                    />
                  </>
                ) : (
                  <Texts
                    className="mt-8"
                    text="No results found matching your search query"
                  />
                )}
              </>
            )}
          </Await>
        </Suspense>
      </div>
    </>
  );
}

Component.displayName = "SearchEvents";
