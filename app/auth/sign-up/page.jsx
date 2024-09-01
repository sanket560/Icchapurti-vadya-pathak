"use client";
import { GlobalContext } from "@/context/GlobalContext";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

const Page = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    adminSecret: "",  // Added for admin role
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { isLoggedIn } = useContext(GlobalContext);
  const router = useRouter();

  // Function to handle input changes
  const handleInput = (e) => {
    const { name, value } = e.target;
    setUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // Check if the selected role is admin
    if (name === "role" && value === "admin") {
      setIsAdmin(true);
    } else if (name === "role" && value !== "admin") {
      setIsAdmin(false);
      setUser((prevState) => ({ ...prevState, adminSecret: "" })); // Clear adminSecret
    }
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (user.role === "admin") {
      // Check if the adminSecret matches the environment variable
      if (user.adminSecret !== process.env.NEXT_PUBLIC_ADMIN_SECRET) {
        toast.error("Invalid admin secret.");
        setIsLoading(false);
        return;
      }
    }

    try {
      const response = await fetch("/api/auth/sign-up", {
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
          name: "",
          email: "",
          password: "",
          role: "student",
          adminSecret: "",
        });
        router.push("/auth/sign-in");
      } else {
        toast.error(data.message);
        setUser({
          name: "",
          email: "",
          password: "",
          role: "student",
          adminSecret: "",
        });
      }
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const isValidForm = () => {
    return user &&
      user.name &&
      user.name.trim() !== "" &&
      user &&
      user.email &&
      user.email.trim() !== "" &&
      user &&
      user.password &&
      user.password.trim() !== "" &&
      (user.role !== "admin" || user.adminSecret === process.env.NEXT_PUBLIC_ADMIN_SECRET)
      ? true
      : false;
  };

  useEffect(() => {
    if (isLoggedIn) {
      router.push("/");
    }
  }, [isLoggedIn, router]);

  return (
    <div className="mt-36 md:mt-28">
      <div className="flex items-center justify-center">
        <div className="w-full rounded-lg bg-white p-8 md:w-[600px]">
          <h2 className="mb-4 text-center text-2xl font-semibold">
            Create a new account
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col justify-around ">
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={user.name}
                  onChange={handleInput}
                  className="w-full capitalize rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none"
                  autoComplete="off"
                  placeholder="James Brown"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={user.email}
                  onChange={handleInput}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none"
                  autoComplete="off"
                  placeholder="your@email.com"
                />
              </div>
            </div>
            <div className="mb-6">
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={user.password}
                onChange={handleInput}
                className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                autoComplete="off"
                placeholder="••••••••"
              />
            </div>
            <div className="mb-6">
              <label className="mb-2 block text-sm font-semibold text-gray-700">Role</label>
              <select
                name="role"
                value={user.role}
                onChange={handleInput}
                className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              >
                <option value="student">Student</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {isAdmin && (
              <div className="mb-6">
                <label
                  htmlFor="adminSecret"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Admin Secret
                </label>
                <input
                  type="text"
                  id="adminSecret"
                  name="adminSecret"
                  value={user.adminSecret}
                  onChange={handleInput}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                  autoComplete="off"
                  placeholder="Enter admin secret"
                />
              </div>
            )}

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
                "Register"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Page;
