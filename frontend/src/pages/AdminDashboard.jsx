import Nav from "../components/Nav";
import React, { useContext } from "react";
import { UserDataContext } from "../context/UserDataContext"; // ✅ correct path
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";

const AdminDashboard = () => {
  const { userData } = useContext(UserDataContext);
  const navigate = useNavigate();

  function createstudent() {
    navigate("/createstudent");
  }
  function createsection() {
    navigate("/createsection");
  }
  function allsections() {
    navigate("/allsections");
  }

  return (
    <>
      <Nav />
      <div className="flex flex-col h-[93.2vh] justify-center items-center">
        {userData ? <h1>{userData.name}</h1> : <p>Loading admin data...</p>}
        <div>
          <Card
            className={`w-[80vw] sm:w-[25vw] shadow-lg flex flex-col items-center`}
          >
            <Button className={`w-fit`} onClick={createstudent}>
              Create Student Account
            </Button>
            <Button className={`w-fit`} onClick={createsection}>
              Create Section
            </Button>
            <Button className={`w-fit`} onClick={allsections}>
              Sections
            </Button>
          </Card>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
