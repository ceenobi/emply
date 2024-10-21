import { Link } from "react-router-dom";

type links = {
  to: string;
  text: React.ReactNode;
  className: string;
  icon?: React.FC;
  exact?: boolean;
};

export const RouterLink = ({ to, className, text }: links) => {
  return (
    <Link
      to={to}
      className={`hover:transition duration-150 ease-out ${className}`}
    >
      {text}
    </Link>
  );
};
