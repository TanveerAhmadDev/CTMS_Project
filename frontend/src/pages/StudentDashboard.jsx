import Nav from "@/components/Nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserDataContext } from "@/context/UserDataContext";
import React, { useContext, useState } from "react";

const StudentDashboard = () => {
  const { userData } = useContext(UserDataContext);

  return (
    <>
      <Nav />
      <div className="py-5 md:py-5 md:h-fit flex flex-col justify-center items-center md:flex-row md:justify-center md:flex-wrap">
        <div className="w-[80vw] flex flex-row flex-wrap items-center justify-center gap-3">
          {userData &&
            userData?.section?.tasks.map((elem, index) => {
              const deadlineDate = new Date(elem?.deadline);
              const now = new Date();
              const isDeadlinePassed = deadlineDate < now;

              return (
                <div key={index}>
                  <Card className="w-[90vw] md:w-[25vw] shadow-lg border-2 ">
                    <CardHeader>
                      <CardTitle>
                        <h1 className="" key={index}>
                          {elem.taskTitle}
                        </h1>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="">
                      <div className="flex gap-1 font-semibold">
                        <p className="inline-block text-[#656565]">Sir Name:</p>
                        <h1>{elem.sirName}</h1>
                      </div>

                      <div className="flex gap-1 font-semibold">
                        <p className="inline-block text-[#656565]">
                          Desctiption:
                        </p>
                        <TruncatedText text={elem.description} />
                      </div>

                      <div className="flex gap-1 font-semibold">
                        <p className="inline-block text-[#656565]">
                          Assign On:
                        </p>
                        <h1>
                          {new Date(elem.assginTime).toLocaleString(undefined, {
                            month: "short",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </h1>
                      </div>

                      <h1 className="inline-block mr-1 font-semibold text-[#656565]">
                        Deadline:{" "}
                      </h1>
                      <h1
                        className="inline-block md:mr-1 font-semibold"
                        style={{ color: isDeadlinePassed ? "red" : "green" }}
                      >
                        {new Date(elem.deadline).toLocaleString(undefined, {
                          month: "short",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </h1>
                      <p
                        className="hidden md:inline-block font-semibold"
                        style={{ color: isDeadlinePassed ? "red" : "green" }}
                      >
                        {isDeadlinePassed ? " (Passed)" : ""}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
};

// ✅ TruncatedText Component (inside the same file)
const TruncatedText = ({ text }) => {
  const [expanded, setExpanded] = useState(false);
  const words = text?.split(" ") || [];
  const showToggle = words.length > 3;
  const shortText = words.slice(0, 3).join(" ") + (showToggle ? "" : "");

  return (
    <span className="text-black">
      {expanded ? text : shortText}
      {showToggle && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="ml-1 text-blue-500 hover:underline text-sm"
        >
          {expanded ? "Show less" : "Show more"}
        </button>
      )}
    </span>
  );
};

export default StudentDashboard;
