import {
  ActionButton,
  DataSpinner,
  FormInput,
  FormSelect,
  Headings,
  Texts,
} from "@/components";
import { TaskData } from "@/types/task";
import { Userinfo } from "@/types/user";
import {
  formatEditDate,
  inputFields,
  taskPriority,
  taskStatus,
  validators,
} from "@/utils";
import { Badge, TextField } from "@radix-ui/themes";
import { Suspense, useEffect, lazy, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Controller, useForm } from "react-hook-form";
import { CgMenuGridO } from "react-icons/cg";
import { CiEdit, CiShoppingTag } from "react-icons/ci";
import { HiOutlineUserAdd } from "react-icons/hi";
import {
  useFetcher,
  useLoaderData,
  useNavigate,
  useNavigation,
  useRouteLoaderData,
} from "react-router-dom";
import { toast } from "sonner";
const SimpleMDE = lazy(() => import("react-simplemde-editor"));

export function Component() {
  const { data } = useLoaderData() as { data: TaskData };
  const {
    employees: { data: emp },
  } = useRouteLoaderData("departments-employees") as {
    employees: { data: Userinfo[] };
  };
  const [member, setMember] = useState<string>("");
  const [selectedMembers, setSelectedMembers] = useState<Userinfo[]>([]);
  const [selectedMembersId, setSelectedMembersId] = useState<string[]>([]);
  const [tag, setTag] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm();
  const navigation = useNavigation();
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting";

  useEffect(() => {
    if (data) {
      setValue("title", data?.title);
      setValue("description", data.description);
      setValue("status", data.status);
      setValue("priority", data.priority);
      setValue("startDate", formatEditDate(data.startDate));
      setValue("endDate", formatEditDate(data?.endDate as string));
      setValue("tags", data.tags);
      setTags([...data.tags]);
    }
  }, [data, setValue]);

  useEffect(() => {
    if (fetcher && fetcher.data && fetcher.data?.status === 200) {
      toast.success(fetcher.data.data.msg as string, {
        id: "taskUpdate-success",
      });
      navigate("/tasks");
    }
  }, [navigate, fetcher]);

  useEffect(() => {
    if (member) {
      const lowerCaseMember = member.toLowerCase();
      const result = emp.filter((item) =>
        item.firstName.toLowerCase().includes(lowerCaseMember)
      );
      setSelectedMembers((prev) => {
        const newMembers = Array.from(new Set([...prev, ...result]));
        return newMembers.length !== prev.length ? newMembers : prev;
      });
    } else {
      setSelectedMembers((prev) => {
        const filteredMembers = prev.filter((item) =>
          selectedMembersId.includes(item._id as string)
        );
        return filteredMembers.length !== prev.length ? filteredMembers : prev;
      });
    }

    const membersFromData = data.members;
    setSelectedMembers((prev) => {
      const newMembers = [...new Set([...prev, ...membersFromData])];
      return newMembers.length !== prev.length ? newMembers : prev;
    });

    setSelectedMembersId((prev) => {
      const newIds = [
        ...new Set([
          ...prev,
          ...membersFromData.map((member: TaskData) => member._id),
        ]),
      ];
      return newIds.length !== prev.length ? newIds : prev;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, emp, member]);

  const formFields = ["startDate", "endDate"];
  const formFields1 = ["title"];

  const handleTags = (currentInput: string[]) => {
    if (currentInput.length > 0) {
      setTags([...tags, ...currentInput]);
      setTag("");
    }
  };

  const deleteTag = (index: number) => {
    const newTags = [...tags];
    newTags.splice(index, 1);
    setTags(newTags);
  };

  const handleMemberId = (id: string) => {
    setSelectedMembersId([...selectedMembersId, id]);
  };

  const deleteMemberId = (id: string) => {
    const spreadIds = selectedMembersId.filter((item) => item !== id);
    setSelectedMembersId(spreadIds);
  };

  const goBack = () => {
    navigate(-1);
  };

  const onFormSubmit = async (data: TaskData) => {
    const formData = { ...data, tags, members: selectedMembersId };
    fetcher.submit(
      { ...formData, id: data._id },
      { method: "patch", action: `/tasks/${data._id}/edit` }
    );
  };

  return (
    <>
      <Helmet>
        <title>Edit a task</title>
        <meta
          name="description"
          content="Edit your task, set date, assign members."
        />
      </Helmet>
      <Headings className="my-8" text="Edit Task" header={true} />
      {navigation.state === "loading" ? (
        <DataSpinner />
      ) : (
        <div className="py-4 px-2">
          <fetcher.Form
            method="post"
            action={`/tasks/${data._id}/edit`}
            onSubmit={handleSubmit(onFormSubmit)}
          >
            <div className="flex flex-wrap justify-between">
              <div className="flex flex-wrap gap-3">
                <CgMenuGridO className="mt-1" />
                <FormSelect
                  label="Select Status"
                  name="status"
                  id="status"
                  register={register}
                  errors={errors}
                  placeholder="None selected"
                  data={taskStatus}
                  validate={(value) =>
                    validators.validateField(value, "Please select a status")
                  }
                  control={control}
                  isRequired
                  defaultValue={data.status}
                />
                <FormSelect
                  label="Priority"
                  name="priority"
                  id="priority"
                  register={register}
                  errors={errors}
                  placeholder="None selected"
                  data={taskPriority}
                  validate={(value) =>
                    validators.validateField(value, "Please set task priority")
                  }
                  control={control}
                  isRequired
                  defaultValue={data.priority}
                />
              </div>
              <div className="flex flex-wrap gap-3">
                {inputFields
                  .filter((item) => formFields.includes(item.name))
                  .map(
                    ({
                      type,
                      id,
                      name,
                      label,
                      placeholder,
                      Icon,
                      validate,
                      isRequired,
                    }) => (
                      <FormInput
                        type={type || undefined}
                        id={id}
                        name={name}
                        register={register}
                        label={label === "End Date" ? "Due Date" : label}
                        placeholder={placeholder}
                        key={id}
                        errors={errors}
                        Icon={Icon}
                        validate={(value) => validate(value) || undefined}
                        isRequired={isRequired}
                      />
                    )
                  )}
              </div>
              <div>
                <label htmlFor="members" className="text-sm font-semibold">
                  Create tag<span className="text-red-400">*</span>
                </label>
                <TextField.Root
                  placeholder="Create tags"
                  size="2"
                  className="mt-1"
                  value={tag.toLowerCase()}
                  onChange={(e) => setTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const currentInput = e.currentTarget.value
                        .split(", ")
                        .filter((tag) => tag);
                      handleTags(currentInput);
                      e.currentTarget.value = "";
                    }
                  }}
                >
                  <TextField.Slot>
                    <CiShoppingTag />
                  </TextField.Slot>
                </TextField.Root>
              </div>
            </div>
            <div className="my-6 flex gap-3">
              <CiShoppingTag className="mt-1" />
              <div>
                <Texts text="Tags" className="text-sm font-semibold mb-4" />
                <div className="flex flex-wrap gap-3 items-center">
                  {tags.length > 0 ? (
                    <>
                      {tags.map((tag, index) => (
                        <Badge
                          color="sky"
                          key={index}
                          onClick={() => deleteTag(index)}
                          variant="soft"
                          size="2"
                          className="cursor-pointer hover:text-red-400"
                        >
                          {tag} &#10006;
                        </Badge>
                      ))}
                    </>
                  ) : (
                    <Texts text="No tags created" className="text-sm" />
                  )}
                </div>
              </div>
            </div>
            <div className="my-6 flex gap-3">
              <CiEdit className="mt-1" />
              <div className="w-full lg:w-[800px]">
                {inputFields
                  .filter((item) => formFields1.includes(item.name))
                  .map(
                    ({
                      type,
                      id,
                      name,
                      label,
                      placeholder,
                      Icon,
                      validate,
                      isRequired,
                    }) => (
                      <FormInput
                        type={type || undefined}
                        id={id}
                        name={name}
                        register={register}
                        label={label}
                        placeholder={placeholder}
                        key={id}
                        errors={errors}
                        Icon={Icon}
                        validate={(value) => validate(value) || undefined}
                        isRequired={isRequired}
                      />
                    )
                  )}
              </div>
            </div>
            <div className="my-6 flex gap-3">
              <CiEdit className="mt-1" />
              <div>
                <Texts
                  text="Description"
                  className="text-sm font-semibold mb-4"
                />
                <div className="w-[85vw] lg:w-[800px]">
                  <Suspense fallback={<div>Loading editor...</div>}>
                    <Controller
                      name="description"
                      control={control}
                      rules={{ required: "Description is required" }}
                      render={({ field }) => (
                        <>
                          <SimpleMDE
                            placeholder="Description"
                            {...field}
                            className="mt-3"
                          />
                          {errors?.description && (
                            <span className="text-xs text-red-600">
                              {errors?.description?.message as string}
                            </span>
                          )}
                        </>
                      )}
                    />
                  </Suspense>
                </div>
              </div>
            </div>
            <div className="my-6 flex gap-3">
              <HiOutlineUserAdd className="mt-1" />
              <div>
                <Texts
                  text="Assign members"
                  className="text-sm font-semibold mb-4"
                />
                <div className="w-[85vw] lg:w-[800px]">
                  <TextField.Root
                    placeholder="Search employee name"
                    size="2"
                    className="w-full"
                    variant="soft"
                    color="gray"
                    value={member}
                    onChange={(e) => setMember(e.target.value)}
                  />
                </div>
                <div className="mt-4 flex flex-wrap gap-3 items-center">
                  {selectedMembers.map((item, index) => (
                    <Badge
                      color={
                        selectedMembersId.includes(item._id as string)
                          ? "blue"
                          : "orange"
                      }
                      key={index}
                      onClick={() => {
                        const isSelected = selectedMembersId.includes(
                          item._id as string
                        );
                        if (isSelected) {
                          deleteMemberId(item._id as string);
                        } else {
                          handleMemberId(item._id as string);
                        }
                      }}
                      variant="soft"
                      size="2"
                      className="cursor-pointer hover:text-red-400"
                    >
                      {item.firstName.concat(" ", item.lastName)}{" "}
                      {selectedMembersId.includes(item._id as string) &&
                        "\u2716"}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 flex gap-4 items-center justify-end">
              <ActionButton
                type="button"
                text="Cancel"
                style={{
                  cursor: "pointer",
                }}
                size="2"
                variant="soft"
                onClick={goBack}
              />
              <ActionButton
                type="submit"
                text="Update"
                style={{
                  backgroundColor: "var(--sky-300)",
                  color: "white",
                  cursor: "pointer",
                }}
                size="2"
                variant="soft"
                loading={isSubmitting}
                disabled={isSubmitting}
              />
            </div>
          </fetcher.Form>
        </div>
      )}
    </>
  );
}

Component.displayName = "EditTask";
