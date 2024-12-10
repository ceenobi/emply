import { useParams } from "react-router-dom";

export function Component() {
  const { taskStatus } = useParams();
  return <div>{taskStatus}</div>;
}

Component.displyName = "AllTasks";
