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
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { UserDataContext } from "@/context/UserDataContext";

const CreateSection = () => {
  let [sectionName, setSectionName] = useState("");

  let [message, setMessage] = useState(null);
  let navigate = useNavigate();
  let { serverUrl } = useContext(UserDataContext);

  const handleSudmit = async (e) => {
    try {
      e.preventDefault();
const token = localStorage.getItem("token");
      let result = await axios.post(
        serverUrl + "/api/section/createsection",
        { sectionName },
        {headers: {
    Authorization: `Bearer ${token}`,
  },}
      );

      toast.success(result.data.message);
      console.log(result);

      // navigate("/addStudent");
    } catch (error) {
      const errMessage =
        error.response?.data?.msg || "Failed to create section";
      setMessage(errMessage);
      toast.error(errMessage);
      console.error(error);
    }
  };

  return (
    <>
      <Nav />
      <div className="flex justify-center items-center w-full h-screen ">
        <Card className="w-full max-w-sm shadow-lg">
          <CardHeader>
            <CardTitle>Create Section</CardTitle>
          </CardHeader>
          <CardContent>
            <form>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="fullName">Section Name</Label>
                  <Input
                    id="fullName"
                    value={sectionName}
                    type="text"
                    required
                    onChange={(e) => setSectionName(e.target.value)}
                  />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button type="submit" onClick={handleSudmit} className="w-full">
              Add Student
            </Button>
            {message && (
              <p className="text-red-500 text-sm text-center mt-2">{message}</p>
            )}
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default CreateSection;
