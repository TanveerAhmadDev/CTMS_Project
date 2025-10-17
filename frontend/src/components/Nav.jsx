import React, { useContext, useEffect, useState } from "react";
import logo from "../assets/small_logo.png";
import userIcon from "../assets/Default.jpg";
import { UserDataContext } from "../context/UserDataContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "./ui/button";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "./ui/input";
import { X } from "lucide-react";
import { Label } from "./ui/label";

const Nav = () => {
  let {
    userData,
    setUserData,
    menuOpen,
    setMenuOpen,
    serverUrl,
    editProfile,
    setEditProfile,
    role,
  } = useContext(UserDataContext);
  let [userMenu, setUserMenu] = useState(false);
  let [name, setName] = useState("");
  let [email, setEmail] = useState("");
  let [msg, setMsg] = useState(null);

  const navigate = useNavigate();

  function usermenu() {
    setUserMenu((prev) => !prev);
    setMenuOpen(false);
  }
  function Menu() {
    setMenuOpen((prev) => !prev);
    setUserMenu(false);
  }
  function editProfileHandler() {
    setUserMenu((prev) => !prev);
    setEditProfile(true);
  }
  function editProfileHandler2() {
    setEditProfile(true);
  }

  function editProfileHandl() {
    setEditProfile(false);
  }

  async function handleLogout(params) {
    try {
      let result = await axios.post(
        serverUrl + "/api/auth/logout",
        {},
        {
          withCredentials: true,
        }
      );

      console.log(result);
      if (result.data.message === "Logged out successfully") {
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  }

  let roleMenuItems = [];

  if (role === "admin") {
    roleMenuItems = [
      { label: "Home", onClick: () => navigate("/dashboard") },
      { label: "View Users", onClick: () => navigate("/users") },
    ];
  } else if (userData?.userRole === "Cr") {
    roleMenuItems = [
      { label: "Add Task", onClick: () => navigate("/cr/addtask") },
      { label: "Home", onClick: () => navigate("/cr/dashboard") },
    ];
  } else if (userData?.userRole === "Student") {
    roleMenuItems = [
      { label: "Home", onClick: () => navigate("/student/dashboard") },
    ];
  }

  async function updateHandler() {
    try {
      // console.log(userData.userId);

      let result = await axios.post(
        serverUrl + `/api/user/updateUser/${userData.userId}`,
        { name, email }
      );
      console.log(result);
      setMsg(result.data.msg);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (userData?.name) {
      setName(userData.name);
    }
    if (userData?.email) {
      setEmail(userData.email);
    }
    if (editProfile) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [editProfile]);

  // console.log(userData.userRole);

  return (
    <>
      {userData?.userRole === "Student" && editProfile && (
        <div className="fixed inset-0 z-50 flex justify-center items-center">
          <div className="absolute inset-0 bg-black opacity-75"></div>

          <div className="relative z-50 bg-gray-200 w-80 h-90 rounded-lg flex flex-col gap-2 items-center justify-center px-2 md:w-[50vw]">
            <X
              onClick={editProfileHandl}
              className=" absolute top-5 right-5 cursor-pointer"
            />
            <div className="w-full flex flex-col gap-2">
              <Label>Name</Label>
              <Input
                className="md:w-80 border-[#515151] px-2"
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Input>
            </div>
            <div className="w-full flex flex-col gap-2">
              <Label>Email</Label>
              <Input
                className="md:w-80 border-[#515151] px-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></Input>
            </div>
            <Button onClick={updateHandler}>Update</Button>
            {msg && <p>{msg}</p>}
          </div>
        </div>
      )}

      {userMenu && (
        <div className=" shadow-lg flex-col bg-white rounded-lg flex justify-center items-center absolute w-[150px] top-12.5 right-1 h-[15vh]">
          <Button onClick={editProfileHandler}>edit Profile</Button>
          <Button onClick={handleLogout}>Logout</Button>
        </div>
      )}

      {menuOpen && (
        <div className="shadow-lg bg-white absolute w-[150px] top-12.5 left-1 h-[15vh]">
          {roleMenuItems.map((elem, index) => (
            <div
              key={index}
              className="p-2 hover:bg-gray-100 cursor-pointer text-sm border-b last:border-none"
              onClick={() => {
                elem.onClick();
                setMenuOpen(false);
              }}
            >
              {elem.label}
            </div>
          ))}
        </div>
      )}

      <div className="flex bg-[#337ab7] items-center justify-between h-[50px] px-4">
        <div className="left bg-[#337ab7] flex justify-center items-center md:gap-4">
          <img
            src={logo}
            alt=""
            className="h-[45px] hidden md:block cursor-pointer"
          />
          <div className="flex gap-2">
            {userData?.userRole === "Cr" && (
              <Link className="text-white hidden md:block" to={"/cr/dashboard"}>
                {" "}
                Home
              </Link>
            )}

            {userData?.userRole === "Student" && (
              <Link
                className="text-white  hidden md:block"
                to={"/student/dashboard"}
              >
                {" "}
                Home
              </Link>
            )}
            {userData?.userRole === "Student" && (
              <a
                className="text-white hidden md:block cursor-pointer"
                onClick={editProfileHandler2}
              >
                Edit Profile
              </a>
            )}

            {role === "admin" && (
              <Link
                className="text-white  hidden md:block"
                to={"/cr/dashboard"}
              >
                {" "}
                Home
              </Link>
            )}
            {userData?.userRole === "Cr" && (
              <Link className="text-white  hidden md:block" to={"/cr/addtask"}>
                {" "}
                Add Task
              </Link>
            )}
          </div>

          <div className="md:hidden">
            <button
              className="text-white text-2xl focus:outline-none "
              onClick={Menu}
            >
              ☰
            </button>
          </div>
        </div>
        <div className="right flex gap-2 items-center h-full">
          <div className=" rounded-full overflow-hidden">
            <Avatar>
              <AvatarImage
                src={userData?.profileImage || userIcon}
                onClick={usermenu}
              />
              <AvatarFallback>
                {userData?.name?.slice(0, 2).toUpperCase() ?? ""}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex flex-col gap-[0.2] h-full ">
            <p>{userData && userData?.name}</p>
            <p>{userData && userData?.userRole}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Nav;
