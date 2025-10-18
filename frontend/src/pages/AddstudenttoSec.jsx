import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Nav from "@/components/Nav";
import { UserDataContext } from "@/context/UserDataContext";

const AddstudenttoSec = () => {
  let { serverUrl } = useContext(UserDataContext);
  let [students, setStudents] = useState([]);
  let [section, setSection] = useState([]);
  const { id } = useParams();
  useEffect(() => {
    console.log(id);

    const fetching = async () => {
      try {
        const token = localStorage.getItem("token");
        let section = await axios.get(
          serverUrl + `/api/section/findSectionById/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setSection(section.data[0]);

        let result = await axios.get(
          serverUrl + "/api/section/studentWithNoSection"
        );
        setStudents(result?.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetching();
  }, []);

  let assigningSectionHandle = async (sectionName, studentId) => {
    console.log(sectionName);
    console.log(studentId);
    try {
      const token = localStorage.getItem("token");
      let result = await axios.post(
        serverUrl + `/api/section/addstudent`,
        { sectionName, studentId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Nav />
      <div className=" flex flex-col justify-center items-center w-full min-h-screen gap-4 p-4">
        <h2>{section.sectionName}</h2>
        {students.length === 0 ? (
          <p className="text-black">All Students Have section</p>
        ) : (
          students.map((student) => (
            <Card key={student._id} className="w-full max-w-sm shadow-lg">
              <CardHeader>
                <CardTitle>Name: {student.fullName}</CardTitle>
                <CardTitle>
                  Registration_NO: {student.Registration_NO}
                </CardTitle>
                <CardTitle>
                  {/* <Link to={`/addStudent/${student._id}`}>Go To Dashboard</Link> */}
                </CardTitle>
              </CardHeader>
              <CardFooter>
                <Button
                  onClick={() =>
                    assigningSectionHandle(section.sectionName, student._id)
                  }
                >
                  Add To Section: {section.sectionName}
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </>
  );
};

export default AddstudenttoSec;
