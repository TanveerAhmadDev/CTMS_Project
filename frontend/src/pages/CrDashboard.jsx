import Nav from "@/components/Nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserDataContext } from "@/context/UserDataContext";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CrDashboard = () => {
  let navigate = useNavigate();
  let [tasks, setTasks] = useState();
  let { userData, setUserData, reloginMsg, serverUrl } =
    useContext(UserDataContext);

  useEffect(() => {
    if (userData?.section?.tasks) {
      setTasks(userData.section.tasks);
    }
  }, [userData]);

  async function DeleteTask(id) {
    console.log(id);

    try {
      let result = await axios.delete(
        serverUrl + `/api/task/deletetask/${id}`,
        { withCredentials: true }
      );

      console.log(result);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <Nav />
      {reloginMsg ? (
        <p>ReLogin Plz</p>
      ) : (
        <div className="py-5 md:py-5 sm:h-fit sm: flex flex-col justify-center items-center sm:flex-row sm:justify-center sm:flex-wrap">
          <div className="flex flex-row flex-wrap items-center justify-center gap-3">
            {tasks &&
              tasks.map((task, index) => (
                <Card
                  className="w-[80vw] md:w-[20vw] shadow-lg border-1"
                  key={index}
                >
                  <CardHeader>
                    <CardTitle className="flex gap-1">
                      <p className="inline-block text-[#656565]">
                        Task Title:{" "}
                      </p>
                      <h1 className=" inline-block" key={index}>
                        {task.taskTitle}
                      </h1>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-1">
                      <p className="text-[#656565] font-semibold">
                        Description:
                      </p>
                      <h1 className="font-semibold">{task.description}</h1>
                    </div>
                    <div className="flex gap-1 flex-">
                      <p className="text-[#656565] font-semibold">Sir name:</p>
                      <h1 className="font-semibold">{task.sirName}</h1>
                    </div>

                    <Button onClick={() => DeleteTask(task._id)}>
                      Delete Task
                    </Button>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      )}
    </>
  );
};

export default CrDashboard;
