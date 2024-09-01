"use client";
import { GlobalContext } from "@/context/GlobalContext";
import Image from "next/image";
import React, { useContext, useEffect, useState } from "react";
import { AiOutlineSun } from "react-icons/ai";
import toast from "react-hot-toast";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';

const Page = () => {
  const { isLoggedIn, userInfo } = useContext(GlobalContext);
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const response = await fetch(
          `/api/get-attendance?userId=${userInfo?._id}`
        );
        const data = await response.json();
        if (data.success) {
          setAttendanceData(data.attendanceRecords);
        } else {
          toast.error(data.message || "Failed to load attendance data.");
        }
      } catch (error) {
        console.error("Error fetching attendance data", error);
        toast.error("An error occurred while fetching attendance data.");
      } finally {
        setLoading(false);
      }
    };

    if (isLoggedIn) {
      fetchAttendanceData();
    }
  }, [isLoggedIn, userInfo]);

  return (
    <div className="max-w-4xl mx-auto mt-20 px-6 pb-6 bg-white rounded">
      <div className="w-full flex flex-col justify-between items-center">
        <Image
          src="/images/ecchhapurthi logo jpg.jpg"
          width={1000}
          height={1000}
          alt="pathak logo"
          className="w-full h-full md:w-60 object-contain rounded"
        />
      </div>
      {isLoggedIn ? (
        <>
          <div className="flex gap-2 items-center justify-center mt-10 mb-3">
            <AiOutlineSun className="text-xl text-yellow-400" />
            <h1 className="text-2xl capitalize font-semibold md:text-4xl text-center">
              namaskar {userInfo?.name.split(" ")[0]} 🙏
            </h1>
            <AiOutlineSun className="text-xl text-yellow-400" />
          </div>
          {loading ? (
            <div className="">
              <Skeleton className="w-full sm:w-3/4 lg:w-1/2 h-6" />
              <Skeleton className="w-full sm:w-3/4 lg:w-1/2 h-12 mt-4" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse border border-gray-200">
                <thead>
                  <tr>
                    <th className="border border-gray-200 p-2 text-left text-xs md:text-sm">
                      Date
                    </th>
                    <th className="border border-gray-200 p-2 text-left text-xs md:text-sm">
                      Day
                    </th>
                    <th className="border border-gray-200 p-2 text-left text-xs md:text-sm">
                      In Time
                    </th>
                    <th className="border border-gray-200 p-2 text-left text-xs md:text-sm">
                      Out Time
                    </th>
                    <th className="border border-gray-200 p-2 text-left text-xs md:text-sm">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceData.length > 0 ? (
                    attendanceData.map((record, index) => (
                      <tr key={index} className="border-t">
                        <td className="border border-gray-200 p-2 text-xs md:text-sm whitespace-nowrap">
                          {new Date(record.date).toLocaleDateString("en-GB")}
                        </td>
                        <td className="border border-gray-200 p-2 text-xs md:text-sm whitespace-nowrap">
                          {new Date(record.date).toLocaleDateString("en-US", {
                            weekday: "long",
                          })}
                        </td>
                        <td className="border border-gray-200 p-2 text-xs md:text-sm whitespace-nowrap">
                          {record.entryTime
                            ? new Date(record.entryTime).toLocaleTimeString(
                                "en-US",
                                {
                                  hour: "numeric",
                                  minute: "numeric",
                                  hour12: true,
                                }
                              )
                            : "N/A"}
                        </td>
                        <td className="border border-gray-200 p-2 text-xs md:text-sm whitespace-nowrap">
                          {record.exitTime
                            ? new Date(record.exitTime).toLocaleTimeString(
                                "en-US",
                                {
                                  hour: "numeric",
                                  minute: "numeric",
                                  hour12: true,
                                }
                              )
                            : "N/A"}
                        </td>
                        <td
                          className={`border border-gray-200 p-2 text-xs md:text-sm whitespace-nowrap ${
                            record.status === "Approved"
                              ? "text-green-500"
                              : record.status === "Rejected"
                              ? "text-red-500"
                              : "text-orange-500"
                          }`}
                        >
                          {record.status}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center p-4 text-sm">
                        No attendance records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-10 gap-4">
          <Image
            src="/images/PXL_20230919_080717964.jpg"
            width={1000}
            height={500}
            alt="pathak photo"
            className="w-full h-auto object-cover rounded"
          />
          <Image
            src="/images/PXL_20230919_115420882.MP.jpg"
            width={1000}
            height={500}
            alt="pathak photo"
            className="w-full h-auto object-cover rounded"
          />
          <Image
            src="/images/PXL_20230919_081251284.jpg"
            width={1000}
            height={500}
            alt="pathak photo"
            className="w-full h-auto object-cover rounded"
          />
        </div>
      )}
    </div>
  );
};

export default Page;
