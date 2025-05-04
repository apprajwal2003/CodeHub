import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  useEffect(() => {
    const userID = localStorage.getItem("userID");
    if (userID) {
      setCurrentUser(userID);
    }
  }, []);

  const value = {
    currentUser,
    setCurrentUser,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
