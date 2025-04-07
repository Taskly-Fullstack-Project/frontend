import React, { useContext } from "react";
import Progress from "../Progress/Progress";
import moment from "moment";
import { LuTrash } from "react-icons/lu";
import axios from "axios";
import { authContext } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function TaskCard({ project, getAllProjects }) {
  const { token } = useContext(authContext);
  const navigate = useNavigate();

  async function delProject(id) {
    try {
      const { data } = await axios.delete(
        `https://backend-production-574a.up.railway.app/api/v1/projects/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      getAllProjects();
    } catch (error) {
      toast.error(error.response.data.message);
      
    }
  }

  return (
    <div
      className="m-2 w-full md:w-[45%]  bg-gray-100 rounded-xl py-4 shadow-md shadow-gray-100 border border-gray-200/50 cursor-pointer"
    >
      <div className=" flex items-end justify-between gap-3 px-4">
        {project.completed == false ? (
          <div className="bg-cyan-500 text-[11px] font-medium px-4 py-0.5 rounded">
            In Progress
          </div>
        ) : (
          <div className="bg-green-500 text-[11px] font-medium px-4 py-0.5 rounded">
            completed
          </div>
        )}
        <button
          className="text-red-600"
          onClick={() => {
            delProject(project.id);
          }}
        >
          <LuTrash />
        </button>
      </div>

          <div className="flex items-center justify-between">
            

      <div className="px-4 border-l-[4px] border-blue-500" onClick={() => {navigate("/projectdetails",{ state: { id: project.id } })}}>
        <p className="text-sm font-medium text0gray-800 mt-4 line-clamp-2">
          {project.name}
        </p>
        <p className="text-sm  text0gray-800 mt-1.5 line-clamp-2 leading[18px]">
          {project.description}
        </p>
        <p className="text-[13px] text-gray-700/80 font-medium mt-2 mb-2 leading-[18px]">
        createdAT:{" "}
        {moment(new Date(project.createdAt)).format("ddd DD MMM YYYY")}
        </p>
        
       
      </div>
      <div className=" w-[20%] me-10">
              <img src={project.photo} alt="" className="rounded-full w-20 h-20"/>
            </div>
      </div>

      
    </div>
  );
}

export default TaskCard;
