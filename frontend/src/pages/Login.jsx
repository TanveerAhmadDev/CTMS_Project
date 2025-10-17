import React, { useContext, useState } from "react";
import bgImage from "../assets/background.jpg";
import logo from "../assets/small_logo.png";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { UserDataContext } from "@/context/UserDataContext";

const Login = () => {
  let [identifier, setIdentifier] = useState("");
  let [password, setPassword] = useState("");

  let [message, setMessage] = useState(null);
  let [showPassword, setShowPassword] = useState(false);

  let navigate = useNavigate();
  let { serverUrl } = useContext(UserDataContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
console.log(serverUrl);


      const result = await axios.post(serverUrl + "/api/auth/login",
        { identifier, password },
        { withCredentials: true }
      );

      toast.success(result.data.message);

      let url = await result.data.redirectUrl;

      navigate(url);
      console.log(result);
    } catch (error) {
      const message = error?.response?.data?.message || "Login failed";
      setMessage(message);
      toast.error(message);
      console.log(error);
    }
  };

  function ShowPasswordHandler() {
    setShowPassword((prev) => !prev);
  }

  return (
    <div className="w-screen h-screen relative flex justify-center items-center">
      <Toaster />
      <img
        src={bgImage}
        alt=""
        className="w-[100%] h-[100%]  object-cover absolute top-0 -z-10"
      />

      <div className="bg-white w-[351px] h-fit  sm:max-w-[456px] sm:min-w-[456px] sm:h-[578.1px] relative rounded-lg overflow-hidden">
        <div className=" text-center title w-full h-[170px] bg-[#337ab7] p-[24px]">
          <h1
            style={{ fontFamily: "Sarabun, sans-serif", fontWeight: "600" }}
            className=" text-[20px] text-white sm:w-[380px] text-center  uppercase leading-[24px]"
          >
            University of Engineering & Technology Mardan
          </h1>
          <p
            style={{
              fontFamily: "Roboto, sans-serif",
              color: "rgba(255, 255, 255, .5",
            }}
          >
            Welcome to CTMS Portal
          </p>
        </div>
        <img
          src={logo}
          className="w-[110px] absolute top-30 left-30 sm:left-43"
          alt=""
        />

        <div className="flex flex-col gap-5 mt-15  pt-5  pl-10 pr-10 text-[#495057] ">
          <div className="flex flex-col">
            <Label htmlFor="UserName" className="mb-1 font-[Roboto,sans-serif]">
              Username
            </Label>

            <Input
              className="px-3 font-[Roboto,sans-serif] border-[0.8px] border-[#4950577b] rounded-[4px]"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Username"
            />
          </div>
          <div className="flex flex-col">
            <label
              style={{
                fontFamily: "Roboto, sans-serif",
                fontSize: "14px",
              }}
              className="mb-1"
              htmlFor="Password"
            >
              Password
            </label>
            <div className="flex justify-center items-center border-[0.8px] px-3 border-[#4950577b] rounded-[4px] focus:outline-none focus:border-[#337ab7] ">
              <Input
                type={showPassword ? "text" : "password"}
                className="font-[Roboto,sans-serif] border-0"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
              {showPassword ? (
                <EyeOff onClick={ShowPasswordHandler} />
              ) : (
                <Eye onClick={ShowPasswordHandler} />
              )}
            </div>
          </div>
          {message && (
            <p className="text-red-500 text-sm text-center mt-2">{message}</p>
          )}
        </div>
        <div className="flex justify-end p-7 pl-10 pr-10">
          <Button className="bg-[#337ab7]" onClick={handleSubmit}>
            Login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
