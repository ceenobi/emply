import { TextField } from "@radix-ui/themes";
import { useEffect, useRef, useState } from "react";
import { FiAlignJustify, FiSearch } from "react-icons/fi";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import UserDp from "./UserDp";
import { useDebouncedCallback } from "use-debounce";
import { useAuthProvider, useToggleSidebar } from "@/store";
import { Userinfo } from "@/types/user";
export default function Nav() {
  const { user } = useAuthProvider();
  const { isOpenSideBar, setIsOpenSideBar, setHideSideBar } =
    useToggleSidebar() as {
      isOpenSideBar: boolean;
      setIsOpenSideBar: (isOpen: boolean) => void;
      setHideSideBar: (hide: boolean) => void;
    };

  const [searchParams] = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const query = searchParams.get("query") || inputRef.current?.value || "";
  const [inputValue, setInputValue] = useState(query);
  const path = location.pathname.split("/")[1];

  useEffect(() => {
    setInputValue(query);
  }, [query]);

  useEffect(() => {
    const inputElement = inputRef.current;
    return () => {
      if (inputElement) {
        inputElement.value = "";
      }
    };
  }, [location.pathname]);

  useEffect(() => {
    if (inputRef.current && inputRef.current?.value !== "") {
      const params = new URLSearchParams(searchParams);
      params.set("query", inputRef.current?.value);
      navigate(`${path}/search?${params.toString()}`);
    }
  }, [inputRef.current?.value, navigate, path, searchParams]);

  const handleSearch = useDebouncedCallback((e) => {
    e.preventDefault();
    const value = e.target.value;
    const params = new URLSearchParams(searchParams);
    if (value) {
      if (value.length > 3) {
        params.set("query", value);
        navigate(`${path}/search?${params.toString()}`);
      } else {
        params.delete("query");
      }
    }
  }, 400);

  const handleToggle = () => {
    setIsOpenSideBar(!isOpenSideBar);
    setHideSideBar(false);
  };

  return (
    <div className="sticky top-0 z-30 flex items-center p-4 justify-between bg-white">
      {!isOpenSideBar && (
        <FiAlignJustify
          onClick={handleToggle}
          size="1.5rem"
          className="lg:hidden cursor-pointer"
          aria-description="control sidebar"
        />
      )}
      <div className="w-[65%] md:w-[400px] rounded-xl">
        <TextField.Root
          size="3"
          placeholder={`Search ${path}`}
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            handleSearch(e);
          }}
          disabled={location.pathname.startsWith("/settings")}
        >
          <TextField.Slot>
            <FiSearch height="16" width="16" />
          </TextField.Slot>
        </TextField.Root>
      </div>
      <UserDp user={user as Userinfo} />
    </div>
  );
}
