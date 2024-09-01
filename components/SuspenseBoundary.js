import React, { Suspense } from "react";

const SuspenseBoundary = ({ children }) => (
  <Suspense
    fallback={
      <div className="flex items-center justify-center h-screen">
        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
      </div>
    }
  >
    {children}
  </Suspense>
);

export default SuspenseBoundary;
