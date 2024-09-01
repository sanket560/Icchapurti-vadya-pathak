"use client";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const AttendanceApprovalPage = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [groupedRecords, setGroupedRecords] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendanceRecords = async () => {
      try {
        const res = await fetch("/api/attendance-approval");
        const data = await res.json();

        if (data.success) {
          setAttendanceRecords(data.attendanceRecords);
          groupRecordsByDate(data.attendanceRecords);
        } else {
          toast.error("Failed to fetch attendance records.");
        }
      } catch (error) {
        console.error("Error fetching attendance records:", error);
        toast.error("Something went wrong.");
      } finally {
        setLoading(false); // Ensure loading is set to false after data is fetched or if there's an error
      }
    };

    fetchAttendanceRecords();
  }, []);

  const groupRecordsByDate = (records) => {
    const grouped = records.reduce((acc, record) => {
      const date = new Date(record.date).toLocaleDateString("en-GB");
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(record);
      return acc;
    }, {});

    setGroupedRecords(grouped);
  };

  const handleApproval = async (attendanceId, status) => {
    const approvalPromise = fetch("/api/attendance-approval", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ attendanceId, status }),
    }).then((res) => res.json());

    toast.promise(approvalPromise, {
      loading: "Updating status...",
      success: (data) => {
        const updatedRecords = attendanceRecords.map((record) =>
          record._id === attendanceId ? { ...record, status } : record
        );
        setAttendanceRecords(updatedRecords);
        groupRecordsByDate(updatedRecords);
        return `Attendance ${status.toLowerCase()}!`;
      },
      error: "Failed to update attendance status.",
    });
  };
  return (
    <div className="max-w-4xl mx-auto mt-20 px-6 pb-6 bg-white rounded">
      <h1 className="text-2xl font-semibold mb-6">Attendance Approval</h1>
      {loading ? (
        <div>
          <Skeleton className="w-full sm:w-3/4 lg:w-1/2 h-6" />
          <Skeleton className="w-full sm:w-3/4 lg:w-1/2 h-12 mt-4" />
        </div>
      ) : (
        <>
          {Object.keys(groupedRecords).length === 0 ? (
            <p>No attendance records found.</p>
          ) : (
            <>
              {/* Table format for large screens */}
              <div className="hidden lg:block">
                {Object.keys(groupedRecords).map((date) => (
                  <div key={date} className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">Date: {date}</h2>
                    <div className="overflow-x-auto">
                      <table className="min-w-full border-collapse border border-gray-200">
                        <thead>
                          <tr>
                            <th className="border border-gray-200 p-2 text-left text-sm">
                              Name
                            </th>
                            <th className="border border-gray-200 p-2 text-left text-sm">
                              Enter Time
                            </th>
                            <th className="border border-gray-200 p-2 text-left text-sm">
                              Exit Time
                            </th>
                            <th className="border border-gray-200 p-2 text-left text-sm">
                              Status
                            </th>
                            <th className="border border-gray-200 p-2 text-left text-sm">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {groupedRecords[date].map((record) => (
                            <tr key={record._id} className="border-t">
                              <td className="border border-gray-200 capitalize p-2 text-sm whitespace-nowrap">
                                {record.userId.name}
                              </td>
                              <td className="border border-gray-200 p-2 text-sm whitespace-nowrap">
                                {new Date(record.entryTime).toLocaleTimeString(
                                  "en-US",
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )}
                              </td>
                              <td className="border border-gray-200 p-2 text-sm whitespace-nowrap">
                                {record.exitTime
                                  ? new Date(
                                      record.exitTime
                                    ).toLocaleTimeString("en-US", {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })
                                  : "N/A"}
                              </td>
                              <td
                                className={`border border-gray-200 p-2 text-sm whitespace-nowrap ${
                                  record.status === "Approved"
                                    ? "text-green-500"
                                    : record.status === "Rejected"
                                    ? "text-red-500"
                                    : "text-orange-500"
                                }`}
                              >
                                {record.status}
                              </td>
                              <td className="border border-gray-200 p-2 text-sm whitespace-nowrap">
                                <button
                                  onClick={() =>
                                    handleApproval(record._id, "Approved")
                                  }
                                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-2 rounded mr-2"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() =>
                                    handleApproval(record._id, "Rejected")
                                  }
                                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded"
                                >
                                  Reject
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>

              {/* Box format for small screens */}
              <div className="lg:hidden">
                {Object.keys(groupedRecords).map((date) => (
                  <div key={date} className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">Date: {date}</h2>
                    <div className="flex overflow-x-auto space-x-4">
                      {groupedRecords[date].map((record) => (
                        <div
                          key={record._id}
                          className="bg-white border border-gray-200 rounded p-4 flex-shrink-0 w-64"
                        >
                          <h3 className="text-lg capitalize font-semibold mb-2">
                            {record.userId.name}
                          </h3>
                          <p className="text-sm mb-1">
                            Entry Time:{" "}
                            {new Date(record.entryTime).toLocaleTimeString(
                              "en-US",
                              { hour: "2-digit", minute: "2-digit" }
                            )}
                          </p>
                          <p className="text-sm mb-1">
                            Exit Time:{" "}
                            {record.exitTime
                              ? new Date(record.exitTime).toLocaleTimeString(
                                  "en-US",
                                  { hour: "2-digit", minute: "2-digit" }
                                )
                              : "N/A"}
                          </p>
                          <p className="text-sm mb-2">
                            Status:{" "}
                            <span
                              className={`${
                                record.status === "Approved"
                                  ? "text-green-500"
                                  : record.status === "Rejected"
                                  ? "text-red-500"
                                  : "text-orange-500"
                              }`}
                            >
                              {record.status}
                            </span>
                          </p>

                          <div className="flex space-x-2">
                            <button
                              onClick={() =>
                                handleApproval(record._id, "Approved")
                              }
                              className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-2 rounded"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() =>
                                handleApproval(record._id, "Rejected")
                              }
                              className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default AttendanceApprovalPage;
