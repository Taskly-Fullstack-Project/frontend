import React, { useEffect, useState } from 'react';
import { HiOutlineMenu, HiOutlineX, HiOutlineBell } from 'react-icons/hi';
import SideMenu from '../SideMenu/SideMenu';
import logo from "./../../assets/images/logo4.png";
import NotificationDropdown from '../NotificationDropdown/NotificationDropdown';
import socket from "../../socket";
import axios from 'axios';

function Navbar({ activeMenu }) {
  const [sideMenu, setSideMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isConnected, setIsConnected] = useState(socket.connected);
  const[notifications,setNotifications] = useState([])


  useEffect(() => {
    function onConnect() {
      console.log("connect");
      
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onNotification(notification) {
      setNotifications((prev) => [notification, ...prev]);
    }
    

    function onNotifications(notifications) {
      setNotifications(notifications)
     
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("notification", onNotification);
    socket.on("notifications", onNotifications);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('notification',onNotification );
      socket.off('notifications',onNotifications );
    };
  });

// useEffect(()=>{
//   console.log(notifications?.length);
  
// },[notifications])


const markAsRead = async () => {
  try {
    const response = await axios.patch(
      `https://backend-production-574a.up.railway.app/api/v1/users/notifications`,
      {},
      { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
    );
    
    // console.log(response);
    setNotifications((prev) =>
      prev.map((x) => ({ ...x, read: true }))
    );
  } catch (err) {
    console.error('Error marking notification as read:', err);
  }
};

  return (
    <div className='flex justify-between items-center border-b border-gray-200/50 backdrop-blur-[2px] py-4 px-7 sticky top-0 z-30 bg-white'>
      <div className='flex items-center gap-5'>
        <button
          className='lg:hidden text-black block'
          onClick={() => { setSideMenu(!sideMenu) }}>
          {sideMenu ? (
            <HiOutlineX className='text-2xl' />
          ) : (
            <HiOutlineMenu className="text-2xl" />
          )}
        </button>
        <h3 className='font-medium text-black text-2xl'><img src={logo} alt="" className='w-20' /></h3>
      </div>

      {/* Notification Icon */}
      <div className="relative">
        <button 
          onClick={() => setShowNotifications(!showNotifications)}
          className="p-1 rounded-full hover:bg-gray-100 relative"
        >
          <HiOutlineBell className="text-2xl text-gray-600 hover:text-black" />


          {notifications?.filter((x)=>{return x.read==false}).length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {notifications.filter((x)=>{return x.read==false}).length}
            </span>
          )}
        </button>
        
        {/* Notification Dropdown */}
        {showNotifications && (
          <div className="absolute right-0 mt-2 bg-white rounded-md shadow-lg border border-gray-200 z-50">
            <div className="flex justify-between items-center border-b p-3">
              <h3 className="font-semibold">Notifications</h3>
              <button 
                onClick={() => setShowNotifications(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <HiOutlineX size={18} />
              </button>
            </div>
            <NotificationDropdown  notifications={notifications} show={setShowNotifications} read={markAsRead}/>
          </div>
        )}
      </div>

      {sideMenu && (
        <div className="fixed top-[60px] -ml-8 bg-white lg:hidden shadow-lg rounded-br-lg">
          <SideMenu activeMenu={activeMenu} />
        </div>
      )}
    </div>
  );
}

export default Navbar;