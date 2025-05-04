import React, { useEffect } from "react";
import { useNavigate, useRoutes } from "react-router-dom";
import Dashboard from "./components/dashboard/Dashboard.jsx";
import Profile from "./components/user/Profile.jsx";
import Login from "./components/auth/Login.jsx";
import Signup from "./components/auth/Signup.jsx";

import { useAuth } from "./AuthContext";

export const ProtectedRoutes = () => {
  const { currentUser, setCurrentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const userIDfromStorage = localStorage.getItem("userID");

    if (userIDfromStorage && !currentUser) {
      setCurrentUser(userIDfromStorage);
    }

    if (
      !userIDfromStorage &&
      !["/login", "/signup"].includes(window.location.pathname)
    ) {
      navigate("/login");
    }

    if (
      userIDfromStorage &&
      (window.location.pathname == "/login" || "/signup")
    ) {
      navigate("/");
    }
  }, [currentUser, navigate, setCurrentUser]);

  let element = useRoutes([
    {
      path: "/",
      element: <Dashboard />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/signup",
      element: <Signup />,
    },
    {
      path: "/profile",
      element: <Profile />,
    },
  ]);

  return element;
};
