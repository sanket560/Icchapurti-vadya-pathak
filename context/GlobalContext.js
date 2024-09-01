"use client";
import Cookies from "js-cookie";
import { createContext, useEffect, useState } from "react";
export const GlobalContext = createContext(null);

export default function GlobalState({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const token = Cookies.get("token");
    const storedUser = localStorage.getItem("user");
    if (token && storedUser) {
      setIsLoggedIn(true);
      setUserInfo(JSON.parse(storedUser));
    } else {
      setIsLoggedIn(false);
    }
  }, []);
  
  return (
    <GlobalContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        userInfo,
        setUserInfo,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
