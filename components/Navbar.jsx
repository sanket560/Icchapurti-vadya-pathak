"use client";
import React, { useState, useEffect, useContext, useRef } from "react";
import { FiUser } from "react-icons/fi";
import { RxCross1 } from "react-icons/rx";
import { RxHamburgerMenu } from "react-icons/rx";
import Link from "next/link";
import { GlobalContext } from "@/context/GlobalContext.js";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { isLoggedIn, setIsLoggedIn, userInfo, setUserInfo } =
    useContext(GlobalContext);
  const menuRef = useRef(null);

  const isAdmin = userInfo?.role;

  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserInfo(false);
    Cookies.remove("token");
    localStorage.clear();
    router.push("/");
    toast.success("Logout! See You Soon");
  };

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="shadow w-full fixed top-0 left-0">
      <div className="flex items-center h-16 justify-between bg-white py-2 md:py-0 md:px-10 px-4">
        <div className="font-bold sm:text-xl md:text-2xl cursor-pointer flex items-center gap-1">
          <Link href="/">
            <h1>इच्छापूर्ति वाद्य पथक</h1>
          </Link>
        </div>
        <div className="flex items-center">
          <div className="flex items-center relative" ref={menuRef}>
            {isLoggedIn ? (
              <>
                <FiUser
                  className="w-7 h-7 cursor-pointer mx-2 md:mx-3"
                  onClick={() => setOpen(!open)}
                />
                {open && (
                  <ul
                    className={`absolute w-36 right-0 top-16 bg-white shadow-md py-2 z-10 rounded-md ${
                      open ? "block" : "hidden"
                    }`}
                  >
                    {isAdmin === "admin" && (
                      <Link href={"/attendance-approval"}>
                        <li className="px-4 py-2 cursor-pointer">Review</li>
                      </Link>
                    )}
                    <Link href={"/profile"}>
                      <li className="px-4 py-2 cursor-pointer">Profile</li>
                    </Link>
                    <Link href={"/attendance"}>
                      <li className="px-4 py-2 cursor-pointer">Attendance</li>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 cursor-pointer text-red-600"
                    >
                      Logout
                    </button>
                  </ul>
                )}
              </>
            ) : (
              <Link href="/auth/sign-in">
                <button className="hidden md:block btn md:w-20 w-80 bg-[#4285f4] hover:bg-[#6f9eff] text-white md:ml-8 font-semibold px-3 py-1 rounded duration-500 md:static">
                  Login
                </button>
              </Link>
            )}
          </div>
        </div>
        {!isLoggedIn && (
          <>
            <div
              onClick={() => setOpen(!open)}
              className="md:hidden cursor-pointer"
            >
              {open ? (
                <RxCross1 className="size-7" />
              ) : (
                <RxHamburgerMenu className="size-7" />
              )}
            </div>
            <ul
              className={`md:hidden md:items-center md:pb-0 py-3 absolute md:static bg-white md:z-auto z-[-1] left-0 w-full md:w-auto md:pl-0 pl-[2rem] transition-all duration-100 ease-in ${
                open ? "top-24" : "top-[-490px]"
              }`}
            >
              <Link href="/auth/sign-in">
                <button className="btn w-80 md:w-16 bg-[#4285f4] hover:bg-[#6f9eff] text-white md:ml-8 font-semibold px-3 py-1 rounded duration-100 md:static">
                  login
                </button>
              </Link>
            </ul>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
