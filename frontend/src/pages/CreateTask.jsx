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

import { ChevronDownIcon } from "lucide-react";
// import { Button } from "@/components/ui/button";
import { Calendar } from "../components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { UserDataContext } from "@/context/UserDataContext";

const CreateTask = () => {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(new Date());
  let [taskTitle, setTaskTitle] = useState("");
  let [description, setDescription] = useState("");
  let [sirName, setSirName] = useState("");
  let [subjectName, setSubjectName] = useState("");
  let [message, setMessage] = useState(null);
  let { serverUrl } = useContext(UserDataContext);

  console.log(
    date.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  );

  async function addTaskHandler() {
    try {
      let result = await axios.post(
        serverUrl + "/api/task/addtask",
        {
          taskTitle,
          sirName,
          subjectName,
          date,
          description,
        },
        { headers: {
    Authorization: `Bearer ${token}`,
  },}
      );
      console.log(result);
      console.log(date);

      setMessage(result.data.msg);
      setTaskTitle("");
      setSirName("");
      setSubjectName("");
    } catch (error) {
      console.log(error);
      setMessage(error.response.data.msg);
    }
  }

  return (
    <>
      <Nav />
      <div className="flex justify-center items-center w-full h-screen">
        <Card className="w-full max-w-sm shadow-lg mt-10 border-2">
          <CardHeader>
            <CardTitle className="text-center">Assign Task</CardTitle>
          </CardHeader>
          <CardContent>
            <form>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="taskTitle">Task Title</Label>
                  <Input
                    id="taskTitle"
                    value={taskTitle}
                    type="text"
                    required
                    onChange={(e) => setTaskTitle(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="sirName">Description</Label>
                  <Input
                    id="sirName"
                    type="text"
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="sirName">Sir Name</Label>
                  <Input
                    id="sirName"
                    type="text"
                    required
                    value={sirName}
                    onChange={(e) => setSirName(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Subject Name</Label>
                  </div>
                  <Input
                    id="subjectName"
                    type="text"
                    required
                    value={subjectName}
                    onChange={(e) => setSubjectName(e.target.value)}
                  />
                </div>
              </div>
            </form>
          </CardContent>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="date-picker" className="px-1">
                  Date
                </Label>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      id="date-picker"
                      className="w-32 justify-between font-normal"
                    >
                      {date ? date.toLocaleDateString() : "Select date"}
                      <ChevronDownIcon />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto overflow-hidden p-0"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      selected={date}
                      captionLayout="dropdown"
                      onSelect={(date) => {
                        setDate(date);
                        setOpen(false);
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="time-picker" className="px-1">
                  Time
                </Label>
                <Input
                  type="time"
                  id="time-picker"
                  step="0"
                  defaultValue="09:00"
                  className=" px-4 bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button type="submit" className="w-full" onClick={addTaskHandler}>
              Add Task
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

export default CreateTask;
