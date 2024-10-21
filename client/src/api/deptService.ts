import { http } from "@/utils";
const getDepartments = async () => {
  return await http.get("/departments");
};


export default { getDepartments};
