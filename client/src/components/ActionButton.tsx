import { Button } from "@radix-ui/themes";
import { ButtonProps } from "@radix-ui/themes";

interface ActionButtonProps extends ButtonProps {
  text: string;
}
export default function ActionButton({
  type,
  color,
  variant,
  size,
  loading,
  text,
  ...rest
}: ActionButtonProps) {
  return (
    <Button
      type={type}
      color={color}
      variant={variant}
      size={size}
      loading={loading}
      {...rest}
    >
      {text}
    </Button>
  );
}
