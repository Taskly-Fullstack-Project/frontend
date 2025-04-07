import React, { useContext, useEffect, useState } from 'react'
import IMJK from "./../../assets/images/task_bg.png"
import { MdDashboard,MdPeopleAlt  } from "react-icons/md";
import { CiLogout,CiSquarePlus } from "react-icons/ci";
import { FaTasks } from "react-icons/fa";
import { authContext } from '../../Context/AuthContext';
import axios from 'axios';
import { Link, NavLink, useNavigate } from 'react-router-dom';



function SideMenu() {

  const {token} = useContext(authContext);
  const [userData,setUserData] = useState(null)

  const navigate = useNavigate()

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
    } catch (error) {
      console.log(error);
      
    }
  }

  useEffect(() => {
    if (!userData) { 
      getUserData();
    }
  }, [userData]);
  
  function logout()
  {
    localStorage.removeItem("token")
    navigate("/login")
  }

  return (
    <div className=' w-52 h-[calc(100vh-62px)]  border-r border-gray-200/50  sticky top-[60px] z-20'>
       <div className="flex flex-col items-center justify-center  mb-7 pt-5">
        <div className="relative">
        <img src={userData?.photo} alt='profilePic' className='w-20 h-20 bg-slate-400 rounded-full'/>
        </div>

        <h5 className='text-gray-950 font-medium leading-6 mt-3'>{userData?.username}</h5>
        <p className='text-[12px] text-gray-500'>{userData?.email}</p>
       </div>
       
       <NavLink to={"/dashboard"} className="w-full flex items-center gap-4 text-[17px] py-2 px-6 mb-3 cursor-pointer"><MdDashboard />Dashboard</NavLink>
       <NavLink to={"/myprojects"} className="w-full flex items-center gap-4 text-[17px] py-2 px-6 mb-3 cursor-pointer"><FaTasks />My Projects</NavLink>
       <NavLink to={"/createproject"} className="w-full flex items-center gap-4 text-[17px] py-2 px-6 mb-3 cursor-pointer"><CiSquarePlus />New Project</NavLink>
       {/* <NavLink onClick={()=>{logout()}} className="w-full flex items-center gap-4 text-[17px] py-2 px-6 mb-3 cursor-pointer"><CiLogout />logout</NavLink> */}
       {/* <button className="w-full flex items-center gap-4 text-[17px] py-2 px-6 mb-3 cursor-pointer text-blue-500 bg-blue-50 border-r-4 border-blue-500" 
       onClick={()=>{navigate("/dashboard")}}>
        <MdDashboard />Dashboard
       </button> */}
       {/* <button className="w-full flex items-center gap-4 text-[17px] py-2 px-6 mb-3 cursor-pointer" 
       onClick={()=>{navigate("/myprojects")}}>
        <FaTasks />My Projects
       </button> */}
       {/* <button className="w-full flex items-center gap-4 text-[17px] py-2 px-6 mb-3 cursor-pointer" 
       onClick={()=>{navigate("/createproject")}}>
        <CiSquarePlus />New Project
       </button> */}
       
       <button className="  w-full text-red-400 hover:text-red-600 font-semibold flex items-center gap-4 text-[17px] py-2 px-6 mb-3 cursor-pointer" 
       onClick={()=>{logout()}}>
        <CiLogout />
        logout
       </button>
      
    </div>
  )
}

export default SideMenu
