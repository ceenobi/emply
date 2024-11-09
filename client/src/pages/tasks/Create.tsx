import {
  ActionButton,
  FormInput,
  FormSelect,
  Headings,
  Texts,
} from "@/components";
// import { useAuthProvider } from "@/store";
import { Userinfo } from "@/types/user";
import { inputFields, taskPriority, taskStatus, validators } from "@/utils";
import { lazy, Suspense, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm, Controller } from "react-hook-form";
import { useFetcher, useNavigate, useRouteLoaderData } from "react-router-dom";
import { toast } from "sonner";
import { CiShoppingTag, CiEdit } from "react-icons/ci";
import { Badge, TextField } from "@radix-ui/themes";
import { HiOutlineUserAdd } from "react-icons/hi";
import { CgMenuGridO } from "react-icons/cg";
const SimpleMDE = lazy(() => import("react-simplemde-editor"));

export function Component() {
  const [member, setMember] = useState<string>("");
  const [selectedMembers, setSelectedMembers] = useState<Userinfo[]>([]);
  const [selectedMembersId, setSelectedMembersId] = useState<string[]>([]);
  const [tag, setTag] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  //   const { user } = useAuthProvider() as { user: Userinfo };
  const {
    employees: { data },
  } = useRouteLoaderData("departments-employees") as {
    employees: { data: Userinfo[] };
  };
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm();

  useEffect(() => {
    if (fetcher && fetcher.data && fetcher.data?.status === 201) {
      toast.success(fetcher.data.data.msg as string, {
        id: "create-task-success",
      });
      navigate("/tasks");
    }
  }, [navigate, fetcher]);

  const isSubmitting = fetcher.state === "submitting";
  const formFields = ["startDate", "endDate"];
  const formFields1 = ["title"];

  const goBack = () => {
    navigate(-1);
  };

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

  useEffect(() => {
    if (member !== "") {
      const result = data
        .filter((item) =>
          item.firstName.toLowerCase().includes(member.toLowerCase())
        )
        .map((item) => item);
      setSelectedMembers((prev) => [...new Set([...prev, ...result])]);
    } else {
      setSelectedMembers(
        selectedMembers.filter((item) =>
          selectedMembersId.includes(item._id as string)
        )
      );
    }
  }, [data, member, selectedMembers, selectedMembersId]);

  const onFormSubmit = async (data: object) => {
    const formData = { ...data, tags, members: selectedMembersId };
    fetcher.submit(
      { ...formData },
      { method: "post", action: "/tasks/create" }
    );
  };

  return (
    <>
      <Helmet>
        <title>Create a task</title>
        <meta
          name="description"
          content="Create your task, set date, assign members."
        />
      </Helmet>
      <Headings className="my-8" text="Create Task" header={true} />
      <div className="py-4 px-2">
        <fetcher.Form
          method="post"
          action="/tasks/create"
          onSubmit={handleSubmit(onFormSubmit)}
        >
          <div className="flex flex-wrap justify-between">
            <div className="flex flex-wrap gap-3 items-center">
              <CgMenuGridO />
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
                    {selectedMembersId.includes(item._id as string) && "\u2716"}
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
              text="Create"
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
    </>
  );
}

Component.displayName = "CreateTask";
