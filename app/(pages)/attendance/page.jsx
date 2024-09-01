"use client";
import React, { useState, useEffect, useContext } from "react";
import { GlobalContext } from '@/context/GlobalContext.js';
import toast from "react-hot-toast";

const Page = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isMounted, setIsMounted] = useState(false);
  const [isEntered, setIsEntered] = useState(false);
  const [isLeft, setIsLeft] = useState(false);
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const { userInfo } = useContext(GlobalContext);

  useEffect(() => {
    setIsMounted(true);

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const hour = currentTime.getHours();
    setIsButtonEnabled(hour >= 18 && hour < 21);
  }, [currentTime]);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const response = await fetch(`/api/get-attendance?userId=${userInfo?._id}`);
        const data = await response.json();

        if (data.success && data.attendanceRecords.length > 0) {
          const todayAttendance = data.attendanceRecords.find(record => {
            const recordDate = new Date(record.date).toDateString();
            return recordDate === new Date().toDateString();
          });

          if (todayAttendance) {
            if (todayAttendance.entryTime) {
              setIsEntered(true);
            }
            if (todayAttendance.exitTime) {
              setIsLeft(true);
            }
          }
        } else {
          console.log("Failed to load today's attendance data.");
        }
      } catch (error) {
        console.error("Error fetching attendance data", error);
      }
    };

    if (userInfo?._id) {
      fetchAttendanceData();
    }
  }, [userInfo]);

  useEffect(() => {
    const checkProfileCompleteness = async () => {
      try {
        const response = await fetch(`/api/get-profile-data?id=${userInfo?._id}`);
        const data = await response.json();

        if (data.success) {
          const { phoneNumber, dateOfBirth, gender, vadya, responsiblePersonName, responsiblePersonEmail, responsiblePersonPhoneNumber } = data.user;

          const isComplete = phoneNumber && dateOfBirth && gender && vadya && responsiblePersonName && responsiblePersonEmail && responsiblePersonPhoneNumber;
          setIsProfileComplete(isComplete);
        } else {
          console.log("Failed to load profile data.");
        }
      } catch (error) {
        console.error("Error fetching profile data", error);
      }
    };

    if (userInfo?._id) {
      checkProfileCompleteness();
    }
  }, [userInfo]);

  const formattedDate = currentTime.toLocaleDateString("en-GB");
  const formattedTime = currentTime.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  });

  const handleMarkAttendance = async (action) => {
    if (!isProfileComplete) {
      toast.error("Please complete your profile before marking attendance.");
      return;
    }

    try {
      const response = await fetch("/api/mark-attendance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: userInfo._id, action }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success(data.message);

        if (action === "entered") {
          setIsEntered(true);
        } else if (action === "left") {
          setIsLeft(true);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error marking attendance", error);
      toast.error("Failed to mark attendance");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="mb-8 flex items-center justify-center gap-3">
        <h1 className="text-xl font-semibold text-gray-800">
          {formattedDate}
        </h1>
        {isMounted && (
          <h1 className="text-xl text-gray-600">{formattedTime}</h1>
        )}
      </div>

      <div className="space-x-4">
        <button
          onClick={() => handleMarkAttendance("entered")}
          className={`bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded shadow-md transition duration-200 ${
            (!isButtonEnabled || isEntered) ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={!isButtonEnabled || isEntered}
        >
          Mark as Entered
        </button>

        <button
          onClick={() => handleMarkAttendance("left")}
          className={`bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded shadow-md transition duration-200 ${
            (!isButtonEnabled || isLeft) ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={!isButtonEnabled || isLeft}
        >
          Mark as Left
        </button>
      </div>
    </div>
  );
};

export default Page;
