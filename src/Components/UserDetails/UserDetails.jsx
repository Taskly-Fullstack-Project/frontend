import axios from 'axios';
import React from 'react';
import toast from 'react-hot-toast';
import { 
  LuUserCheck, 
  LuUserX, 
  LuClock, 
  LuUserMinus,
  LuMail,
  LuTrash2,
  LuShield,
  LuUser
} from 'react-icons/lu';
import { useLocation, useNavigate } from 'react-router-dom';

const MemberDetailsCard = () => {


    const location = useLocation();
    const { memberData , projectId ,managerId ,userData} = location.state || {};
    const navigate = useNavigate()
    console.log(memberData);
    

    async function deleteMember(memberId) {
        try {
            await axios.delete(
                `https://backend-production-574a.up.railway.app/api/v1/projects/${projectId}/members/${memberId}`,
                {
                  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                }
              );
          toast.success("Member removed successfully");
        navigate("/projectdetails" , {state:{id:projectId}})
        } catch (error) {
          console.error("Error removing member:", error);
          toast.error(error.response?.data?.message || "Failed to remove member");
        }
      }

      async function leave() {
        try {
            await axios.patch(
                `https://backend-production-574a.up.railway.app/api/v1/projects/${projectId}/leave`,{},
                {
                  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                }
              );
          
        navigate("/dashboard")
        } catch (error) {
          console.error(error);
          toast.error(error.response?.data?.message);
        }
      }
      async function promoteToManager() {
        try {
            await axios.post(
                `https://backend-production-574a.up.railway.app/api/v1/projects/${projectId}/members/${memberData.user.id}`,{},
                {
                  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                }
              );
              toast.success("promotion done successfully");
              navigate("/projectdetails" , {state:{id:projectId}})
        } catch (error) {
          console.error(error);
          toast.error(error.response?.data?.message);
        }
      }
      async function promoteToSupervisor() {
        try {
            await axios.patch(
                `https://backend-production-574a.up.railway.app/api/v1/projects/${projectId}/members/${memberData.user.id}`,
                {
                    role : "SUPERVISOR"
                },
                {
                  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                }
              );
              toast.success("promotion done successfully");
              navigate("/projectdetails" , {state:{id:projectId}})
        } catch (error) {
          console.error(error);
          toast.error(error.response?.data?.message);
        }
      }
  

  const statusConfig = {
    JOINED: { icon: <LuUserCheck className="text-green-500" />, text: 'Active Member', color: 'bg-green-100 text-green-800' },
    REMOVED: { icon: <LuUserX className="text-red-500" />, text: 'Removed', color: 'bg-red-100 text-red-800' },
    INVITATIONPENDING: { icon: <LuClock className="text-yellow-500" />, text: 'Invitation Pending', color: 'bg-yellow-100 text-yellow-800' },
    LEFT: { icon: <LuUserMinus className="text-gray-500" />, text: 'Left Project', color: 'bg-gray-100 text-gray-800' }
  };

  return (
    <div className="w-full h-[calc(100vh-150px)] flex justify-center items-center">
    <div className="w-[40%] mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-blue-50 p-4 flex justify-between items-center border-b">
        <h2 className="text-lg font-semibold text-gray-800">Member Details</h2>
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${statusConfig[memberData.memberStatus].color}`}>
          {statusConfig[memberData.memberStatus].icon}
          <span className="ml-2">{statusConfig[memberData.memberStatus].text}</span>
        </span>
      </div>

      {/* Profile Section */}
      <div className="p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative">
            <img 
              className="h-16 w-16 rounded-full border-2 border-white shadow" 
              src={memberData.user.photo} 
              alt={memberData.user.username} 
            />
            <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow-sm">
              {statusConfig[memberData.memberStatus].icon}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold">{memberData.user.username}</h3>
            <p className="text-gray-600">ID : {memberData.user.id}</p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <DetailItem icon={<LuUser className="text-gray-400" />} label="Role" value={memberData.role} />
          
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-5">

        {userData.id == managerId && memberData.role!="MANAGER" && memberData.memberStatus !="REMOVED" && memberData.memberStatus !="LEFT" ?<button className="flex items-center px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
          onClick={()=>{deleteMember(memberData.user.id)}}>
            <LuTrash2 className="mr-2" />
            Remove
          </button>:""}
          {userData.id == memberData.user.id?<button className="flex items-center px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
          onClick={()=>{leave()}}>
            <LuTrash2 className="mr-2" />
            Leave
          </button>:""}

            {userData.id == managerId && memberData.memberStatus=="JOINED" && memberData.role=="MEMBER"?<button className="flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
            onClick={()=>{promoteToSupervisor()}}>
            <LuMail className="mr-2" />
            promote to supervisor
          </button>:""}
          {userData.id == managerId && memberData.memberStatus=="JOINED" && memberData.role!="MANAGER"?<button className="flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
          onClick={()=>{promoteToManager()}}>
            <LuMail className="mr-2" />
            promote to manager
          </button>:""}

          

          
        </div>
      </div>
    </div></div>
  );
};

// Reusable detail component
const DetailItem = ({ icon, label, value }) => (
  <div className="flex items-start">
    <span className="mr-2 text-gray-400">{icon}</span>
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  </div>
);

export default MemberDetailsCard;