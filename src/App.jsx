import React, { useEffect, useState } from "react";
import { createBrowserRouter, createHashRouter, RouterProvider } from "react-router-dom";
import Login from "./Components/Login/Login";
import SignUp from "./Components/Signup/SignUp";
import Layout from "./Components/Layout/Layout";
import VerificationCode from "./Components/VerificationCode/VerificationCode";
import DashBoard from "./Components/DashBoard/DashBoard";
import TaskCard from "./Components/TaskCard/TaskCard";
import CreateProject from "./Components/CreateProject/CreateProject";
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";
import { Toaster } from "react-hot-toast";
import AuthContextProvider from "./Context/AuthContext";
import Tasks from "./Components/Tasks/Tasks";
import MyProjects from "./Components/MyProjects/MyProjects";
import "flowbite";
import ProjectDetails from "./Components/ProjectDetails/ProjectDetails";
import CreateTask from "./Components/CreateTask/CreateTask";
import UpdateProject from "./Components/UpdateProject/UpdateProject";
import TaskDetails from "./Components/TaskDetails/TaskDetails";
import UserDetails from "./Components/UserDetails/UserDetails";

function App() {

  const route = createBrowserRouter([
    { path: "/", element: <Login /> },
        { path: "/login", element: <Login /> },
        { path: "/signup", element: <SignUp /> },
        { path: "/verificationcode", element: <VerificationCode /> },
    {
      path: "",
      element: <Layout />,
      children: [
        
        {
          path: "/dashboard",
          element: (
            <ProtectedRoute>
              <DashBoard />
            </ProtectedRoute>
          ),
        },
        {
          path: "/createproject",
          element: (
            <ProtectedRoute>
              <CreateProject />
            </ProtectedRoute>
          ),
        },
        {
          path: "/myprojects",
          element: (
            <ProtectedRoute>
              <MyProjects />
            </ProtectedRoute>
          ),
        },
        {
          path: "/projectdetails",
          element: (
            <ProtectedRoute>
              <ProjectDetails />
            </ProtectedRoute>
          ),
        },
        {
          path: "/createtask",
          element: (
            <ProtectedRoute>
              <CreateTask />
            </ProtectedRoute>
          ),
        },
        {
          path: "/updateproject",
          element: (
            <ProtectedRoute>
              <UpdateProject />
            </ProtectedRoute>
          ),
        },
        {
          path: "/taskdetails",
          element: (
            <ProtectedRoute>
              <TaskDetails />
            </ProtectedRoute>
          ),
        },{
          path: "/userdetails",
          element: (
            <ProtectedRoute>
              <UserDetails />
            </ProtectedRoute>
          ),
        },
      ],
    },
  ]);

  

  return (
    <AuthContextProvider>
      <Toaster />
      <RouterProvider router={route} />
    </AuthContextProvider>
  );
}

export default App;
