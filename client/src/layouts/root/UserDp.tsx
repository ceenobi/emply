import { Texts } from "@/components/Typography";
import { Userinfo } from "@/types/user";
import { Avatar } from "@radix-ui/themes";

export default function UserDp({ user }: { user: Userinfo }) {
  return (
    <div className="flex items-center gap-2">
      <Avatar
        size="3"
        src={user?.photo}
        fallback={user?.firstName?.slice(0, 1)}
        variant="soft"
      />
      <div className="hidden md:flex flex-col">
        <Texts
          className="font-bold text-sm mb-0"
          text={user?.firstName + " " + user?.lastName}
        />
        <Texts
          className="capitalize text-sm"
          text={user?.role || user?.jobTitle}
        />
      </div>
    </div>
  );
}
