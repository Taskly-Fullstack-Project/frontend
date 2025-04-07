import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SideMenu from "../SideMenu/SideMenu";
import { LuTrash } from "react-icons/lu";
import axios from "axios";
import { authContext } from "../../Context/AuthContext";
import toast from "react-hot-toast";
import { RingLoader,ScaleLoader } from "react-spinners";



function ProjectDetails() {



  const token = localStorage.getItem("token")
  const [project, setProject] = useState(null);
  const [members, setMembers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
    const [userData,setUserData] = useState(null)
    const [addMemberLoading, setAddMemberLoading] = useState(null);

  

  const location = useLocation();
  const { id } = location.state || {};
  const navigate = useNavigate();

  // Fetch all project data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await Promise.all([getProject(),getUserData(), getTasks()]);
      } catch (error) {
        toast.error("Failed to load project data");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  async function getProject() {
    try {
      const response = await axios.get(
        `https://backend-production-574a.up.railway.app/api/v1/projects/${id}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      console.log(response.data);
      
      setProject(response.data.data.project);
      setMembers(response.data.data.project.members)
      
    } catch (error) {
      toast.error("Failed to load project details");
    }
  }

  // async function getMembers() {
  //   try {
  //     const response = await axios.get(
  //       `https://backend-production-574a.up.railway.app/api/v1/projects/${id}/members`,
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }
  //     );
  //     console.log(response.data.data.members);
      
  //     setMembers(response.data.data.members);
  //   } catch (error) {
  //     console.error("Error fetching members:", error);
  //     toast.error("Failed to load team members");
  //   }
  // }
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
      // console.log(data.data.me);
    } catch (error) {
      console.log(error);
      
    }
  }
  async function getTasks() {
    try {
      const response = await axios.get(
        `https://backend-production-574a.up.railway.app/api/v1/projects/${id}/tasks`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(response.data.data);
      
      setTasks(response.data.data.tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to load tasks");
    }
  }

  async function addTask(taskData) {
    try {
      // Format the data before sending
      const formattedData = {
        ...taskData,
        dueDate: taskData.dueDate
          ? new Date(taskData.dueDate).toISOString()
          : null,
      };

      const response = await axios.post(
        `https://backend-production-574a.up.railway.app/api/v1/projects/${id}/tasks`,
        formattedData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      getTasks()
      setShowAddTaskModal(false);
      toast.success("Task added successfully");
      
      
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add task");
    }
  }

  async function addMember(memberId) {
    // console.log(memberId);
    setAddMemberLoading(true)
    
    try {
      const response = await axios.post(
        `https://backend-production-574a.up.railway.app/api/v1/projects/${id}/members`,
        {
          "memberId": memberId
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // setMembers((prev) => [...prev, response.data.data.member]);
      toast.success("Member invited successfully");
      setShowAddMemberModal(false)
    } catch (error) {
      console.error("Error adding member:", error);
      toast.error(error.response?.data?.message || "Failed to add member");
    }
    setAddMemberLoading(false)

  }

  async function deleteMember(memberId) {
    try {
      await axios.delete(
        `https://backend-production-574a.up.railway.app/api/v1/projects/${id}/members/${memberId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMembers((prev) => prev.filter((member) => member.id !== memberId));
      toast.success("Member removed successfully");
    } catch (error) {
      console.error("Error removing member:", error);
      toast.error(error.response?.data?.message || "Failed to remove member");
    }
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in progress":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-400 text-gray-800";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "low":
        return "bg-blue-100 text-blue-800";
      case "medium":
        return "bg-purple-100 text-purple-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const AddNewTaskModal = () => {
    const [formData, setFormData] = useState({
      title: "",
      description: "",
      // status: "",
      assignedTo: "",
      dueDate: "",
      priority: "MEDIUM",
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      addTask(formData);
    };

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg w-full max-w-md">
          <div className="border-b border-gray-200 p-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Add New Task
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Task Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter task title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Enter task description"
              />
            </div>

            

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assigned To
                </label>
                <select
                  name="assignedTo"
                  value={formData.assignedTo}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select team member</option>
                  {members.map((member) => (
                    <option key={member.id} value={member.userId}>
                      {member.userId} ({member.role})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select status</option>
                  <option value="Not Started">Not Started</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div> */}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>
            </div>

            <div className="border-t border-gray-200 p-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowAddTaskModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
              >
                Add Task
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const AddNewMemberModal = () => {
    const [formData, setFormData] = useState({
      username: "",
      userId:""
    });
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [debounceTimer, setDebounceTimer] = useState(null);
  
    // Search users API call
    const searchUsers = async (query) => {
      if (!query.trim()) {
        setSearchResults([]);
        return;
      }
  
      setIsSearching(true);
      try {
        const response = await axios.get(`https://backend-production-574a.up.railway.app/api/v1/users/search?query=${query}`,{
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        console.log(response.data.data);
        
        setSearchResults(response.data.data);
      } catch (error) {
        console.error("Search failed:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };
  
    // Debounced search handler
    const handleSearchChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
  
      // Clear previous timer
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
  
      // Set new timer
      setDebounceTimer(
        setTimeout(() => {
          searchUsers(value);
        }, 300) // 300ms debounce delay
      );
    };
  
    // Clean up timer on unmount
    useEffect(() => {
      return () => {
        if (debounceTimer) {
          clearTimeout(debounceTimer);
        }
      };
    }, [debounceTimer]);
  
    const handleSubmit = (e) => {
      e.preventDefault();
      // Your existing submit logic
      addMember(formData.userId);
    };
  
    const handleUserSelect = (user) => {
      setFormData(prev => ({ ...prev, username: user.username,userId: user.id }));
      setSearchResults([]); // Clear results after selection
    };
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg w-full max-w-md">
          <div className="border-b border-gray-200 p-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Invite member to join
            </h2>
          </div>
  
          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                User Name
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleSearchChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search users..."
                required
                autoComplete="off"
              />
              
              {/* Search results dropdown */}
              {searchResults.length > 0 && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                  {searchResults.map(user => (
                    <div
                      key={user.id}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleUserSelect(user)}
                    >
                      <div className="font-medium">{user.username}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  ))}
                </div>
              )}
              
              {isSearching && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 mt-6">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
                </div>
              )}
            </div>
  
            <div className="border-t border-gray-200 p-4 flex justify-center space-x-3">
              <button
                type="button"
                onClick={() => setShowAddMemberModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
              >
                {addMemberLoading ? (
                  <ScaleLoader width={2} height={10} color="#ffffff" />
                ) : (
                  "Add Member"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <div className=""><RingLoader color="#3B82F6"/></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex">
        <div className="max-[1080px]:hidden">
          <SideMenu />
        </div>
        <div className="w-full lg:w-[80%] mx-auto p-5 font-sans text-gray-800">
          <div className="flex justify-center items-center h-64">
            <p>Project not found</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex">
        <div className="max-[1080px]:hidden">
          <SideMenu />
        </div>
        <div className="w-full lg:w-[80%] mx-auto p-5 font-sans text-gray-800">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                {project.name}
              </h1>
              <span className="text-gray-500 text-sm">
                Created on: {new Date(project.createdAt).toLocaleDateString()}
              </span>
            </div>


            {userData.id == project.manager.id ? <button
              onClick={() =>
                navigate("/updateproject", { state: { id: project.id } })
              }
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Update Project
            </button>:""}
            
          </div>

          <div className="mb-8 p-4 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-semibold mb-2 text-gray-700">
              Description
            </h2>
            <p className="text-gray-600">{project.description}</p>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-700">
                  Team Members
                </h2>

                {userData.id == project.manager.id ? <button
                  onClick={() => setShowAddMemberModal(true)}
                  className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition"
                >
                  Add Member
                </button>:""}


                

              </div>
              <ul className="space-y-3">
                {members.map((member) => (
                  <li
                    key={member.id}
                    className="group p-3 bg-gray-50 rounded flex justify-between items-center"
                  >
                    <div className="flex justify-center items-center gap-3">
                      <img src={member.user.photo} alt=""  className="rounded-full w-10 h-10"/>
                      <div className="">
                      <span className="font-medium">{member.user.username}</span>
                      <span className="block text-gray-500 text-sm">
                        {member.role}/{member.memberStatus}
                      </span>
                      </div>
                    </div>

                    {userData.id == project.manager.id ? <button
                      onClick={() => deleteMember(member.userId)}
                      className="opacity-0 group-hover:opacity-100 px-2 py-1 bg-red-100 text-red-600 rounded text-xs hover:bg-red-200 transition"
                    >
                      <LuTrash />
                    </button>:""}

                    
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:flex-1">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-700">Tasks</h2>

                {userData.id == project.manager.id ? <button
                  onClick={() => setShowAddTaskModal(true)}
                  className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition"
                >
                  Add New Task
                </button>:""}

                
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg overflow-hidden">
                  <thead className="bg-gray-100">
                    <tr>
                    <th className="py-3 px-2 md:px-8 text-center text-gray-700 font-medium">
                        Title
                      </th>
                      <th className="py-3 px-2 md:px-8 text-center text-gray-700 font-medium">
                        Creator
                      </th>
                      <th className="py-3 px-2 md:px-8 text-center text-gray-700 font-medium">
                        Status
                      </th>
                      <th className="py-3 px-2 md:px-8 text-center text-gray-700 font-medium">
                        Priority
                      </th>
                      <th className="py-3 px-2 md:px-8 text-center text-gray-700 font-medium">
                        Assigned To
                      </th>
                      
                    </tr>
                  </thead>
                  {tasks.length>0 &&<tbody className="divide-y divide-gray-200">
                    {tasks?.map((task) => {
                      
                      return (
                        <tr key={task?.id}>
                          <td className="py-3 px-2 md:px-8 cursor-pointer" onClick={() => {
                                navigate("/taskdetails",{ state: { taskId: task.id , projectId:id ,userData:userData} })
                              }}>{task?.title}</td>
                          <td className="py-3 px-2 md:px-8 flex justify-center items-center gap-3">
                          <img src={task?.creator.user.photo} alt="" className="w-10 rounded-full h-10 "/>
                            {task?.creator.user.username}
                          </td>
                          <td className="py-3 px-2 md:px-8">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                task.status
                              )}`}
                            >
                              {task?.status}
                            </span>
                          </td>
                          <td className="py-3 px-2 md:px-8">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                                task.priority
                              )}`}
                            >
                              {task.priority}
                            </span>
                          </td>
                          <td className="py-3 px-2 md:px-8 flex justify-center items-center gap-3">
                            <img src={task?.member.user.photo} alt="" className="w-10 rounded-full h-10 " />
                            {task.member.user.username}
                          </td>
                          
                        </tr>
                      );
                    })}
                  </tbody> }
                  
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showAddTaskModal && <AddNewTaskModal />}{showAddMemberModal && <AddNewMemberModal />}
    </div>
  );
}

export default ProjectDetails;




