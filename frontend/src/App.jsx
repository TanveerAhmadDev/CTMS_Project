import React, { useContext } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import CreateStudent from "./pages/CreateStudent";
import CreateSection from "./pages/CreateSection";
import { UserDataContext } from "./context/UserDataContext"; // Assuming this is defined
import StudentDashboard from "./pages/StudentDashboard";
import CrDashboard from "./pages/CrDashboard";
import Allsections from "./pages/Allsections";
import AddstudenttoSec from "./pages/AddstudenttoSec";
import Cookies from "js-cookie";
import CreateTask from "./pages/CreateTask";

const App = () => {
  const { userData } = useContext(UserDataContext);

  const router = createBrowserRouter([
    { path: "/", element: <Login /> },
    {
      path: "/dashboard",
      element: <AdminDashboard />,
    },
    { path: "/createstudent", element: <CreateStudent /> },
    { path: "/createsection", element: <CreateSection /> },
    {
      path: "/student/dashboard",
      element: <StudentDashboard />,
    },
    {
      path: "/cr/dashboard",
      element: <CrDashboard />,
    },
    { path: "/allsections", element: <Allsections /> },
    { path: "/addStudent/:id", element: <AddstudenttoSec /> },
    { path: "/cr/addtask", element: <CreateTask /> },
  ]);

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
