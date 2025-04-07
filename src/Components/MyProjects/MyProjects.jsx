import React, { useContext, useEffect, useState } from 'react'
import SideMenu from '../SideMenu/SideMenu'
import { authContext } from '../../Context/AuthContext';
import axios from 'axios';
import TaskCard from '../TaskCard/TaskCard';
import noTask from "../../assets/images/noproject.png"
import { RingLoader } from 'react-spinners';
import toast from 'react-hot-toast';


function MyProjects() {
    const [projects, setProjects] = useState([]);
    const {token} = useContext(authContext);
        const [isLoading,setIsLoading]=useState(false)
    
    async function getAllProjects() {
      setIsLoading(true)
        try {
            
            const response = await axios.get("https://backend-production-574a.up.railway.app/api/v1/projects", 
                {
              headers: {
                Authorization: `Bearer ${token}`, 
              },
            });
            setProjects(response.data.data.projects)
            
          } catch (error) {
            toast.error(error.response.data.message);
          }
          setIsLoading(false)
    }
    
    useEffect(() => {
        if (token) {
            getAllProjects();
        }
    }, [token]);

  return (
    <div>
      {isLoading?(
        <div className="w-full h-[calc(100vh-75px)] flex justify-center items-center">
        <div className=""><RingLoader color="#3B82F6"/></div>
      </div> ):<div className="flex ">
        <div className="max-[1080px]:hidden ">
            <SideMenu/>
        </div>
        <div className="p-4 w-full flex flex-wrap md:w-[82%] h-fit rounded-2xl  mx-3 my-4">
            
            {projects.length == 0 ? <div className="text-center w-[40%] mx-auto mt-5 mb-5">
                            <img src={noTask} alt="No_Tasks" className='w-full' />
                            <p className='font-semibold mb-2'>You've no Projects</p>
                            <p className='font-light'>when you have, you will see them here</p>
                          </div> :projects.map((item,idx)=>{return(
               <TaskCard key={idx} project={item} getAllProjects={getAllProjects}/>
            )})}
        </div>


     </div>
      }

      
    </div>
  )
}

export default MyProjects
