import { AlertDialog, Button, Dialog, Flex } from "@radix-ui/themes";

interface ModalBoxProps {
  trigger?: React.ReactNode;
  title?: React.ReactNode;
  message?: React.ReactNode;
  isSubmitting?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
  open?: boolean;
  setOpen?: (open: boolean) => void;
}

export function AlertBox({
  trigger,
  title,
  children,
  isSubmitting,
  disabled,
  onClick,
  open,
  setOpen,
  ...rest
}: ModalBoxProps) {
  return (
    <AlertDialog.Root open={open} onOpenChange={setOpen}>
      <AlertDialog.Trigger>{trigger}</AlertDialog.Trigger>
      <AlertDialog.Content maxWidth="450px">
        <AlertDialog.Title>{title}</AlertDialog.Title>
        <AlertDialog.Description size="2">{children}</AlertDialog.Description>
        <Flex gap="3" mt="4" justify="end">
          <AlertDialog.Cancel>
            <Button
              variant="soft"
              color="gray"
              onClick={() => setOpen?.(false)}
              style={{ cursor: "pointer" }}
            >
              Cancel
            </Button>
          </AlertDialog.Cancel>
          <Button
            variant="solid"
            color="red"
            loading={isSubmitting}
            onClick={onClick}
            disabled={disabled}
            style={{ cursor: "pointer" }}
            {...rest}
          >
            Delete
          </Button>
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
}

export function InfoBox({ title, children, open, setOpen }: ModalBoxProps) {
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Content maxWidth="450px" maxHeight="600px">
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Description>{children}</Dialog.Description>
      </Dialog.Content>
    </Dialog.Root>
  );
}
