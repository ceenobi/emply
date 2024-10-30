import {
  isRouteErrorResponse,
  useNavigate,
  useRouteError,
} from "react-router-dom";
import { Headings, Texts } from "./Typography";
import ActionButton from "./ActionButton";
import { useEffect } from "react";

export default function ErrorBoundary() {
  const navigate = useNavigate();
  const error = useRouteError() as
    | { response?: { data?: { message?: string; error?: string } } }
    | Error;
  console.error(error);
  const errorMessage: string =
    (error as { response?: { data?: { message?: string; error?: string } } })
      .response?.data?.message ||
    (error as { response?: { data?: { message?: string; error?: string } } })
      .response?.data?.error ||
    (error instanceof Error
      ? error.message
      : "An error has occurred while trying to fetch data");

  useEffect(() => {
    if (errorMessage === "Session expired, pls log in") {
      navigate("/login");
    }
  }, [errorMessage, navigate]);

  if (isRouteErrorResponse(error)) {
    return errorMessage;
  }

  const redirect = () => {
    if (errorMessage === "Session expired, pls log in") {
      return;
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="max-w-[1280px] mx-auto p-6 ">
      <div className="mt-6 flex flex-col justify-center align-items-center h-screen">
        <Headings
          text="Oops!"
          className="text-8xl text-center font-bold"
          header={true}
        />
        <div className="mt-4 text-center">
          <Texts
            text="You have encountered an error"
            className="text-xl text-sky-300"
          />
          <div className="flex gap-2 justify-center">
            {isRouteErrorResponse(error) && error.status && (
              <Texts
                text={`${error.status} -`}
                className="text-xl text-sky-300 font-bold"
              />
            )}
            <Texts
              text={errorMessage}
              className="text-xl text-sky-300 font-bold"
            />
          </div>
          <div className="mt-4 text-center">
            <ActionButton
              className="text-md mx-auto font-semibold"
              onClick={redirect}
              variant="surface"
              size="3"
              type="button"
              text="Go Back"
              style={{ cursor: "pointer" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
