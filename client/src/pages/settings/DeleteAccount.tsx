import { authService } from "@/api";
import { Headings, InfoBox, ActionButton, Texts } from "@/components";
import { useAuthProvider } from "@/store";
import { tryCatchFn } from "@/utils";
import { Button, Card, Flex } from "@radix-ui/themes";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { IoMdArrowDropleftCircle } from "react-icons/io";
import { RiErrorWarningFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function Component() {
  const [openCard, setOpenCard] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const navigate = useNavigate();
  const { logout } = useAuthProvider();

  const handleDeleteModal = () => {
    setOpenCard((prev) => !prev);
  };

  const deleteAccount = tryCatchFn(async () => {
    setIsDeleting(true);
    const { data } = await authService.deleteAccount();
    toast.success(data);
    setIsDeleting(false);
    logout();
  });

  return (
    <>
      <Helmet>
        <title>Delete your account</title>
        <meta name="description" content="Delete user account" />
      </Helmet>
      <IoMdArrowDropleftCircle
        className="text-2xl text-sky-300 cursor-pointer"
        role="button"
        onClick={() => navigate("/settings")}
      />
      <Headings className="my-8" text="Delete your account" header={true} />
      <Card
        className="py-4 px-2 md:w-[50%] mx-auto bg-sky-100"
        variant="surface"
      >
        <Headings
          text="You are about to permanently delete your account. This action will erase all associated data, including your profile information, saved settings, and any content you've created."
          header={false}
          className="my-4 px-2"
        />
        <Headings
          className="my-4 px-2"
          header={false}
          text={
            <>
              <strong>Important:</strong> Once your account is deleted, this
              action cannot be undone. All your information and content will be
              lost and cannot be recovered. Please be absolutely sure that you
              want to proceed with this irreversible decision.
            </>
          }
        />
        <div className="mt-12 w-full flex items-center justify-end gap-8">
          <Button
            variant="soft"
            color="gray"
            onClick={() => navigate("/settings")}
            style={{ cursor: "pointer" }}
          >
            Cancel
          </Button>
          <Button
            variant="solid"
            color="tomato"
            onClick={handleDeleteModal}
            style={{ cursor: "pointer" }}
          >
            Delete
          </Button>
          <InfoBox
            title={
              <div className="flex gap-1 items-center">
                <RiErrorWarningFill size="28px" className="text-red-400" />
                <div>Warning</div>
              </div>
            }
            open={openCard}
            setOpen={setOpenCard}
          >
            <Texts
              text="Are you sure you want to delete your account?"
              className="text-center text-lg"
            />
            <Flex gap="3" mt="4" justify="end">
              <Button
                variant="soft"
                color="gray"
                size="3"
                onClick={handleDeleteModal}
                style={{ cursor: "pointer" }}
                aria-label="close modal"
              >
                Close
              </Button>
              <ActionButton
                type="submit"
                text="Delete"
                size="3"
                color="tomato"
                variant="solid"
                loading={isDeleting}
                disabled={isDeleting}
                onClick={deleteAccount}
              />
            </Flex>
          </InfoBox>
        </div>
      </Card>
    </>
  );
}

Component.displayName = "DeletePassword";
