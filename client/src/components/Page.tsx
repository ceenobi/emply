import { ReactNode } from "react";

interface PageProps {
  children: ReactNode;
  [key: string]: unknown;
}

export default function Page({ children, ...rest }: PageProps) {
  return (
    <div className="py-2 px-4">
      <div {...rest} className="my-4">
        {children}
      </div>
    </div>
  );
}
