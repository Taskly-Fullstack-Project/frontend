import React, { useState, useEffect } from 'react';
import { HiOutlineBell, HiOutlineCheck, HiOutlineX } from 'react-icons/hi';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const NotificationDropdown = ({notifications , show , read}) => {
  const [myNotifications, setMyNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

async function accept(projectId) {
      try {
          
          const response = await axios.post(`https://backend-production-574a.up.railway.app/api/v1/projects/${projectId}/invitation/accept`,{}, 
              {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`, 
            },
          });
         console.log(response.data);
         setMyNotifications([])
         
        } catch (error) {
          toast.error(error.response.data.message);
          console.log(error);
          
        }
  }
  
  async function handleClick(notification) {

    if(notification.targetType=="PROJECT")
    {
        navigate("/projectdetails" ,{state:{id:notification.projectId}} )
    }
    else 
    {
      navigate("/taskdetails" ,{state:{taskId:notification.taskId , projectId:notification.projectId , userData:userData}} )
    }
    show(false)
  }


  useEffect(() => {
    read();
    getUserData();
    // console.log("lllllllll");
    
  }, []); 


  useEffect(() => {
    setMyNotifications(notifications);
  }, [notifications]);
  

  return (
    <div className="w-72 max-h-96 overflow-y-auto">
      {myNotifications.length === 0 ? (
        <div className="p-4 text-center text-gray-500">No notifications</div>
      ) : (
        <ul>
          {myNotifications.map(notification => (
            <li 
              key={notification.id} 
              className={`border-b cursor-pointer border-gray-100 ${!notification.read ? 'bg-blue-50' : ''}`}
              onClick={()=>{handleClick(notification)}}
            >
              <div className="p-3 flex justify-between items-center">
                <div>
                  <p className="font-medium">{notification.title}</p>
                  <p className="text-sm text-gray-600">{notification.message}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
                { notification.targetType=="PROJECT" && (
                  <button 
                    onClick={() => accept(notification.projectId)}
                    className="text-white rounded-full bg-green-500 p-2"
                    title="accept"
                  >
                    <HiOutlineCheck size={16} />
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationDropdown;