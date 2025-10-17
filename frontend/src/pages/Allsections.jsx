import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Nav from "@/components/Nav";
import { UserDataContext } from "@/context/UserDataContext";

const Allsections = () => {
  let [section, setSection] = useState([]);
  let { serverUrl } = useContext(UserDataContext);

  useEffect(() => {
    // Define the async function inside the effect
    const fetchSections = async () => {
      try {
        const result = await axios.get(serverUrl + "/api/section/getsections", {
          withCredentials: true,
        });
        setSection(result.data);
      } catch (error) {
        console.error("Error fetching sections:", error);
      }
    };

    fetchSections();
  }, []);

  return (
    <>
      <Nav />
      <div className="h-fit px-2 py-2 flex gap-2 flex-col justify-center items-center md:flex-row md:min-h-screen md:flex-wrap w-25vh">
        {section.map((elem, index) => {
          return (
            <Card key={index} className="w-full max-w-sm shadow-lg">
              <CardHeader>
                <CardTitle>Section Name: {elem.sectionName}</CardTitle>
                <CardTitle>Total Students: {elem.students.length}</CardTitle>
                <CardTitle>Total Tasks: {elem.tasks.length}</CardTitle>
                <CardTitle>
                  <Button>
                    {" "}
                    <Link to={`/addStudent/${elem._id}`}>Add Students </Link>
                  </Button>
                </CardTitle>
              </CardHeader>
            </Card>
          );
        })}
      </div>
    </>
  );
};

export default Allsections;
