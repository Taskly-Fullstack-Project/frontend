import React, { useContext, useEffect, useState } from "react";
import SideMenu from "../SideMenu/SideMenu";
import moment from "moment";
import InfoCard from "../InfoCard/InfoCard";

import { authContext } from "../../Context/AuthContext";
import axios from "axios";
import noTask from "../../assets/images/noTask.jpg";
import { useNavigate } from "react-router-dom";
import { RingLoader } from "react-spinners";
import toast from "react-hot-toast";

function DashBoard() {
  const { token } = useContext(authContext);
  const [tasks, setTAsks] = useState([]);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
    const [userData,setUserData] = useState(null)

  async function getUserData() {
    
    try {
      const {data} = await axios.get(
        "https://backend-production-574a.up.railway.app/api/v1/users/me",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, 
          },
          
          
        }
      );
      setUserData(data.data.me)
      //  console.log(data.data.me);
    } catch (error) {
      console.log(error);
      
    }
  }

  async function getTasks() {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `https://backend-production-574a.up.railway.app/api/v1/users/myTasks`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      
      
      setTAsks(response.data.data.tasks);
    } catch (error) {
      toast.error(error.response.data.message);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    getTasks();
    getUserData();
  }, []);

  return (
    <>
      {isLoading ? (
        <div className="w-full h-[calc(100vh-75px)] flex justify-center items-center">
          <div className="">
            <RingLoader color="#3B82F6" />
          </div>
        </div>
      ) : (
        <div>
         
          <div className="flex ">
            <div className="max-[1024px]:hidden ">
              <SideMenu />
            </div>
            <div className="p-5 w-full  lg:w-[82%] h-fit rounded-2xl shadow-md shadow-gray-100 border border-gray-200/50 mx-3 my-4">
              <div className="">
                <div className="col-span-3">
                  <h2 className="text-xl md:text-2xl">welcome!</h2>
                  <p className="text-xs md:text-sm text-gray-500 mt-1">
                    {moment().format("dddd Do MMM YYYY")}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mt-5">
                <InfoCard value={tasks?.length} label={"Total Tasks"} />
                <InfoCard
                  value={
                    tasks?.filter((task) => {
                      return task.status == "FINISHED";
                    }).length
                  }
                  label={"completed"}
                />
                <InfoCard
                  value={
                    tasks?.filter((task) => {
                      return task.status == "INPROGRESS";
                    }).length
                  }
                  label={"In progress"}
                />
              </div>

              {tasks?.length == 0 ? (
                <div className="text-center w-[40%] mx-auto mt-5 mb-5">
                  <img src={noTask} alt="No_Tasks" className="w-full" />
                  <p className="font-semibold mb-2">You've no new tasks</p>
                  <p className="font-light">
                    when you have, you will see them here
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4 md:my-6">
                  <div className="md:col-span-2">
                    <div className="">
                      <div className="flex items-center justify-between">
                        <h4 className="text-lg">recent tasks</h4>
                      </div>
                      <div className="overflow-x-auto p-0 rounded-lg mt-3">
                        <table className="min-w-full">
                          <thead>
                            <tr className="text-center">
                              <th className="py-3 px-4 text-gray-800 font-medium text-[13px]">
                                Name
                              </th>
                              <th className="py-3 px-4 text-gray-800 font-medium text-[13px]">
                                Project
                              </th>
                              <th className="py-3 px-4 text-gray-800 font-medium text-[13px]">
                                Status
                              </th>
                              <th className="py-3 px-4 text-gray-800 font-medium text-[13px]">
                                Priority
                              </th>
                              <th className="py-3 px-4 text-gray-800 font-medium text-[13px] hidden md:table-cell">
                                DueDate
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {tasks?.map((item, idx) => {
                              return (
                                <tr className="border-t border-gray-200 text-center">
                                  <td
                                    onClick={() => {
                                      navigate("/taskdetails",{ state: { taskId: item.id , projectId:item.project.id ,userData:userData} })
                                    }}
                                    className="cursor-pointer my-3 mx-4 text-gray-700 text=[13px] line-clamp-1 overflow-hidden"
                                  >
                                    {item.title}
                                  </td>

                                  <td className="py-4 px-4">
                                    {item.project.name}
                                  </td>
                                  <td className="py-4 px-4">
                                    {item.status == "COMPLETED" ? (
                                      <span className="px-2 py-1 text-xs rounded inline-block bg-green-400">
                                        {item.status}
                                      </span>
                                    ) : item.status == "INPROGRESS" ? (
                                      <span className="px-2 py-1 text-xs rounded inline-block bg-violet-400">
                                        {item.status}
                                      </span>
                                    ) : (
                                      <span className="px-2 py-1 text-xs rounded inline-block bg-violet-400">
                                        {item.status}
                                      </span>
                                    )}
                                  </td>
                                  <td className="py-4 px-4">
                                    <span
                                      className={
                                        item.priority == "LOW"
                                          ? "px-2 py-1 text-xs rounded inline-block bg-green-400"
                                          : item.priority == "MEDIUM"
                                          ? "px-2 py-1 text-xs rounded inline-block bg-orange-400"
                                          : "px-2 py-1 text-xs rounded inline-block bg-red-400"
                                      }
                                    >
                                      {item.priority}
                                    </span>
                                  </td>
                                  <td className="py-4 px-4 text-gray-700 text-[13px] text-nowrap hidden md:table-cell">
                                    {moment(item.dueDate).format(
                                      "dddd Do MMM YYYY"
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default DashBoard;
