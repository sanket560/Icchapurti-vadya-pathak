"use client";
import { GlobalContext } from "@/context/GlobalContext";
import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css'

const Page = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [dataUpdating, setDataUpdating] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [userDetails, setUserDetails] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    dateOfBirth: "",
    gender: "",
    vadya: "",
    responsiblePersonName: "",
    responsiblePersonEmail: "",
    responsiblePersonPhoneNumber: "",
  });

  const isValidForm = () => {
    return userDetails &&
      userDetails.phoneNumber &&
      userDetails.phoneNumber.trim() !== "" &&
      userDetails &&
      userDetails.dateOfBirth &&
      userDetails.dateOfBirth.trim() !== "" &&
      userDetails &&
      userDetails.gender &&
      userDetails.gender.trim() !== "" &&
      userDetails.vadya &&
      userDetails.vadya.trim() !== "" &&
      userDetails.responsiblePersonEmail &&
      userDetails.responsiblePersonEmail.trim() !== "" &&
      userDetails.responsiblePersonName &&
      userDetails.responsiblePersonName.trim() !== "" &&
      userDetails.responsiblePersonPhoneNumber &&
      userDetails.responsiblePersonPhoneNumber.trim() !== ""
      ? true
      : false;
  };

  const { userInfo } = useContext(GlobalContext);
  const userId = userInfo?._id;

  useEffect(() => {
    if (!userId) return;

    const fetchUserData = async () => {
      try {
        setDataLoading(true);
        const response = await fetch(`/api/get-profile-data?id=${userId}`);
        const data = await response.json();
        if (data.success) {
          const user = data.user;

          const formattedDateOfBirth = user.dateOfBirth
            ? new Date(user.dateOfBirth).toISOString().split("T")[0]
            : "";

          setUserDetails({
            ...user,
            dateOfBirth: formattedDateOfBirth,
          });
        }
      } catch (error) {
        console.error("Error fetching user data", error);
      }
      setDataLoading(false);
    };

    fetchUserData();
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails({ ...userDetails, [name]: value });
  };

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveClick = async () => {
    const {
      phoneNumber,
      responsiblePersonPhoneNumber,
      email,
      responsiblePersonEmail,
    } = userDetails;

    if (phoneNumber === responsiblePersonPhoneNumber) {
      toast.error(
        "Personal number and Responsible Person's phone number cannot be the same."
      );
      return;
    }

    if (email === responsiblePersonEmail) {
      toast.error(
        "Personal Email and Responsible Person's Email cannot be the same."
      );
      return;
    }

    try {
      setDataUpdating(true);

      const response = await fetch("/api/update-profile-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          phoneNumber: userDetails.phoneNumber,
          dateOfBirth: userDetails.dateOfBirth,
          gender: userDetails.gender,
          vadya: userDetails.vadya,
          responsiblePersonName: userDetails.responsiblePersonName,
          responsiblePersonEmail: userDetails.responsiblePersonEmail,
          responsiblePersonPhoneNumber:
            userDetails.responsiblePersonPhoneNumber,
          isFormFilled: true,
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success(data.message);
        setDataUpdating(false);
        setIsEditing(false);
      } else {
        toast.success(data.message);
      }
      setDataUpdating(false);
    } catch (error) {
      console.error("Error updating user data", error);
      setDataUpdating(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white">
      {dataLoading ? (
        <div className="">
          <Skeleton className="w-full sm:w-3/4 lg:w-1/2 h-6" />
          <Skeleton className="w-full sm:w-3/4 lg:w-1/2 h-12" />
          <Skeleton className="w-full sm:w-3/4 lg:w-1/2 h-6" />
          <Skeleton className="w-full sm:w-3/4 lg:w-1/2 h-12" />
          <Skeleton className="w-full sm:w-3/4 lg:w-1/2 h-6" />
          <Skeleton className="w-full sm:w-3/4 lg:w-1/2 h-12" />
          <Skeleton className="w-full sm:w-3/4 lg:w-1/2 h-6" />
          <Skeleton className="w-full sm:w-3/4 lg:w-1/2 h-12" />
          <Skeleton className="w-full sm:w-3/4 lg:w-1/2 h-6" />
          <Skeleton className="w-full sm:w-3/4 lg:w-1/2 h-12" />
        </div>
      ) : (
        <>
          <form>
            {/* Name */}
            <div className="mb-4">
              <label className="block text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={userDetails.name}
                onChange={handleInputChange}
                disabled
                className="mt-1 p-2 border rounded w-full bg-gray-100"
              />
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={userDetails.email}
                onChange={handleInputChange}
                disabled
                className="mt-1 p-2 border rounded w-full bg-gray-100"
              />
            </div>

            {/* Phone Number */}
            <div className="mb-4">
              <label className="block text-gray-700">Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                value={userDetails.phoneNumber}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`mt-1 focus:outline-none p-2 border rounded w-full ${
                  isEditing ? "bg-white" : "bg-gray-100"
                }`}
              />
            </div>

            {/* Date of Birth */}
            <div className="mb-4">
              <label className="block text-gray-700">Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={userDetails.dateOfBirth}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`mt-1 focus:outline-none p-2 border rounded w-full ${
                  isEditing ? "bg-white" : "bg-gray-100"
                }`}
              />
            </div>

            {/* Gender */}
            <div className="mb-4">
              <label className="block text-gray-700">Gender</label>
              <select
                name="gender"
                value={userDetails.gender}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`mt-1 focus:outline-none p-2 border w-full rounded ${
                  isEditing ? "bg-white" : "bg-gray-100"
                }`}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            {/* Vadya */}
            <div className="mb-4">
              <label className="block text-gray-700">Vadya</label>
              <select
                name="vadya"
                value={userDetails.vadya}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`mt-1 focus:outline-none p-2 border w-full rounded ${
                  isEditing ? "bg-white" : "bg-gray-100"
                }`}
              >
                <option value="">Select Vadya</option>
                <option value="dhol">Dhol</option>
                <option value="tasha">Tasha</option>
                <option value="dhavj">Dhavj</option>
              </select>
            </div>

            {/* Responsible Person Name */}
            <div className="mb-4">
              <label className="block text-gray-700">
                Responsible Person Name
              </label>
              <input
                type="text"
                name="responsiblePersonName"
                value={userDetails.responsiblePersonName}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`mt-1 focus:outline-none p-2 border rounded w-full ${
                  isEditing ? "bg-white" : "bg-gray-100"
                }`}
              />
            </div>

            {/* Responsible Person email */}
            <div className="mb-4">
              <label className="block text-gray-700">
                Responsible Person Email
              </label>
              <input
                type="email"
                name="responsiblePersonEmail"
                value={userDetails.responsiblePersonEmail}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`mt-1 focus:outline-none p-2 border rounded w-full ${
                  isEditing ? "bg-white" : "bg-gray-100"
                }`}
              />
            </div>

            {/* Responsible Person Phone Number */}
            <div className="mb-4">
              <label className="block text-gray-700">
                Responsible Person Phone Number
              </label>
              <input
                type="tel"
                name="responsiblePersonPhoneNumber"
                value={userDetails.responsiblePersonPhoneNumber}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`mt-1 focus:outline-none p-2 border rounded w-full ${
                  isEditing ? "bg-white" : "bg-gray-100"
                }`}
              />
            </div>

            {/* Save Button */}
            {isEditing && (
              <button
                onClick={handleSaveClick}
                disabled={!isValidForm() || dataUpdating}
                type="button"
                className="mt-4 mb-4 w-full bg-green-500 text-white disabled:opacity-50 py-2 px-4 rounded"
              >
                {dataUpdating ? (
                  <div className="flex items-center justify-center">
                    <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-t-2 border-white"></div>
                  </div>
                ) : (
                  "Save"
                )}
              </button>
            )}
          </form>
          {userDetails?.isFormFilled ? (
            ""
          ) : (
            <button
              onClick={handleEditClick}
              className="mb-4 bg-blue-500 w-full hover:bg-blue-600 text-white py-2 px-4 rounded"
            >
              {isEditing ? "Cancel" : "Edit"}
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default Page;
