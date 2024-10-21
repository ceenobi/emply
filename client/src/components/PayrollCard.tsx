import { Headings, Texts } from "@/components";
import { formatCurrency } from "@/utils";
import { Card } from "@radix-ui/themes";
import { TbReportMoney } from "react-icons/tb";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";

type payollSummray = {
  totalNetPay: number;
  totalAllowance: number;
  totalDeductions: number;
};

export default function PayrollCard({
  totalNetPay,
  totalAllowance,
  totalDeductions,
}: payollSummray) {
  const totalAmount = totalNetPay + totalAllowance + totalDeductions;

  const data = [
    {
      id: 1,
      label: "Total Netpay",
      value: formatCurrency(totalNetPay),
      percentage: totalAmount
        ? ((totalNetPay / totalAmount) * 100).toFixed(2) + "%"
        : "0%",
      color: "bg-sky-200",
      icon: <TbReportMoney size="24" className="text-sky-300" />,
    },
    {
      id: 2,
      label: "Total Allowance",
      value: formatCurrency(totalAllowance),
      percentage: totalAmount
        ? ((totalAllowance / totalAmount) * 100).toFixed(2) + "%"
        : "0%",
      color: "bg-cream-100",
      icon: <TbReportMoney size="24" className="text-sky-300" />,
    },
    {
      id: 3,
      label: "Total Deductions",
      value: formatCurrency(totalDeductions),
      percentage: totalAmount
        ? ((totalDeductions / totalAmount) * 100).toFixed(2) + "%"
        : "0%",
      color: "bg-red-500",
      icon: <TbReportMoney size="24" className="text-sky-300" />,
    },
  ];

  return (
    <div className="flex gap-4 items-center overflow-x-scroll overflow-y-hidden">
      {data.map((item) => (
        <Card
          className={`${item.color} min-w-[235px] lg:flex-grow`}
          variant="classic"
          key={item.id}
          size="2"
        >
          <div className="flex justify-between">
            <Texts text={item.label} className="text-sky-300 font-semibold" />
            {item.icon}
          </div>
          <Headings
            text={item.value}
            header={true}
            className="text-[1.8rem] mb-4"
          />
          <Texts
            text={
              <div className="flex items-center gap-1">
                {item.percentage > "50%" ? <FaArrowUp /> : <FaArrowDown />}{" "}
                {item.percentage}
              </div>
            }
            className="text-sky-300 font-semibold"
          />
        </Card>
      ))}
    </div>
  );
}
