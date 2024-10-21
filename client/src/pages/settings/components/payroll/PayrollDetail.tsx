import { ActionButton, InfoBox, Texts } from "@/components";
import { PayrollProps } from "@/types/payroll";
import { formatEditDate, payrollStatusColorMap } from "@/utils";
import { Badge, Separator } from "@radix-ui/themes";

type PayrollDetailProps = {
  setOpenCard: (isOpen: boolean) => void;
  openCard: boolean;
  selectedData: PayrollProps | null;
};
export default function PayrollEmpDetail({
  selectedData,
  openCard,
  setOpenCard,
}: PayrollDetailProps) {
  const handleClose = () => {
    setOpenCard(false);
  };

  return (
    <InfoBox title="Details" open={openCard} setOpen={setOpenCard}>
      <Badge
        size="3"
        variant="soft"
        color={
          payrollStatusColorMap[
            selectedData?.status as keyof typeof payrollStatusColorMap
          ]
        }
      >
        {selectedData?.status}
      </Badge>
      <Separator orientation="horizontal" size="4" className="my-4" />
      <div className="flex gap-2 text-sky-300">
        <Texts text="Payroll Date created:" className="font-semibold" />
        <Texts text={formatEditDate(selectedData?.payrollDate as string)} />
      </div>
      <Separator orientation="horizontal" size="4" className="my-4" />
      <Texts
        text={
          <>
            <strong>Comment:</strong> {selectedData?.comment}
          </>
        }
        className="text-sky-300"
      />
      <Separator orientation="horizontal" size="4" className="my-4" />
      <div className="text-end">
        <ActionButton
          type="button"
          text="Close"
          size="2"
          variant="soft"
          color="gray"
          style={{ cursor: "pointer" }}
          onClick={handleClose}
        />
      </div>
    </InfoBox>
  );
}
