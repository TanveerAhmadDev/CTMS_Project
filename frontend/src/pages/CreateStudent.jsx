import Nav from "@/components/Nav";
import React, { useContext, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { UserDataContext } from "@/context/UserDataContext";

const CreateStudent = () => {
  const [fullName, setFullName] = useState("");
  const [Registration_NO, setRegistrationNO] = useState("");
  const [Password, setPassword] = useState("");
  const [userRole, setUserRole] = useState("");
  let { serverUrl } = useContext(UserDataContext);

  const [msg, setMsg] = useState(null);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      console.log("Btn is click");

      const upperRegNo = Registration_NO.toUpperCase();

      let result = await axios.post(
        serverUrl + "/api/user/usersignup",
        { fullName, Registration_NO: upperRegNo, Password, userRole },
        { headers: {
    Authorization: `Bearer ${token}`,
  }, }
      );
      console.log(result);
      setMsg(result?.data?.msg);
    } catch (error) {
      console.log(error);
      if (error?.response?.data?.error) {
        setMsg(error?.response?.data?.error);
        console.log(msg);
      }

      if (error?.response?.data?.msg) {
        setMsg(error?.response?.data?.msg);
        console.log(msg);
      }
    }
  };

  return (
    <>
      <Nav />
      <div className="flex justify-center items-center w-full h-screen ">
        <Card className="w-full max-w-sm shadow-lg">
          <CardHeader>
            <CardTitle>Create Student Account</CardTitle>
          </CardHeader>
          <CardContent>
            <form>
              <div className="flex flex-col gap-6">
                {/* <div className="grid gap-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    type="text"
                    required
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div> */}
                <div className="grid gap-2">
                  <Label htmlFor="Registration_No">Registration_No</Label>
                  <Input
                    className="px-3"
                    id="Registration_No"
                    type="text"
                    required
                    value={Registration_NO}
                    onChange={(e) => setRegistrationNO(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <Input
                    className="px-3"
                    id="password"
                    type="password"
                    required
                    value={Password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="userRole">Role</Label>
                  <Input
                    className="px-3"
                    id="userRole"
                    type="text"
                    required
                    value={userRole}
                    onChange={(e) => setUserRole(e.target.value)}
                  />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button type="submit" onClick={handleSubmit} className="w-full">
              Add Student
            </Button>

            {msg && (
              <p className="text-red-500 text-sm text-center mt-2">{msg}</p>
            )}
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default CreateStudent;
