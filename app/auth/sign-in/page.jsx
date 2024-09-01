"use client";
import { GlobalContext } from "@/context/GlobalContext";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

const Page = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { setIsLoggedIn, setUserInfo, isLoggedIn } = useContext(GlobalContext);

  // Function to handle input changes
  const handleInput = (e) => {
    const { name, value } = e.target;
    setUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/sign-in", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(user),
      });
  
      const data = await response.json();
  
      if (data.success) {
        toast.success(data.message);
        setUser({
          email: "",
          password: "",
        });
  
        Cookies.set("token", data?.data?.token);
        localStorage.setItem("user", JSON.stringify(data?.data?.user));
        
        setIsLoggedIn(true);  // This should be called after setting the token and user data
        setUserInfo(data?.data?.user);
        router.push("/");  // Redirect after setting the state
      } else {
        toast.error(data.message);
        setUser({
          email: "",
          password: "",
        });
        setIsLoggedIn(false);
        router.push("/auth/sign-in");
      }
    } catch (error) {
      console.log("Error:", error);
      setIsLoggedIn(false);
    } finally {
      setIsLoading(false);
    }
  };
  // console.log(isAuthUser,userInfo);

  const isValidForm = () => {
    return user &&
      user.email &&
      user.email.trim() !== "" &&
      user &&
      user.password &&
      user.password.trim() !== ""
      ? true
      : false;
  };

  useEffect(() => {
    if (isLoggedIn) {
      router.push("/");
    }
  }, [isLoggedIn, router]);

  return (
    <div className="flex h-screen items-center justify-center px-5">
      <div className="w-full max-w-sm rounded-lg bg-white p-8">
        <h2 className="mb-4 text-center text-2xl font-semibold">
          Welcome Back!
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Email Address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={user.email}
              onChange={handleInput}
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none"
              placeholder="your@email.com"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={user.password}
              onChange={handleInput}
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none"
              placeholder="••••••••"
              required
            />
            <Link href={'/auth/forget-password'}>
            <p
              className="text-xs text-gray-600 mt-2 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2"
            >
              Forgot Password?
            </p>
            </Link>
          </div>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:outline-none focus:ring-indigo-500"
                defaultChecked
              />
              <label
                htmlFor="remember"
                className="ml-2 text-sm font-semibold text-gray-700"
              >
                Remember me
              </label>
            </div>
            <Link href="/auth/sign-up">
              <p className="text-xs text-[#60a5fa] hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2">
                Create Account
              </p>
            </Link>
          </div>
          <button
            type="submit"
            disabled={!isValidForm() || isLoading}
            className={`w-full rounded bg-[#60a5fa] px-6 py-1.5 font-medium leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] disabled:opacity-50 ${
              isLoading ? "cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-t-2 border-white"></div>
              </div>
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Page;
