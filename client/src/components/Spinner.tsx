import { Spinner } from "@radix-ui/themes";
import { Texts } from "./Typography";

export function LazySpinner() {
  return (
    <div className="flex flex-col justify-center items-center min-h-dvh">
      <Spinner size="3" />
      <Texts text="EMPLY" className="font-bold" />
    </div>
  );
}

export function DataSpinner() {
  return (
    <div className="flex justify-center items-center min-h-[50vh]">
      <Spinner size="3" />
    </div>
  );
}
