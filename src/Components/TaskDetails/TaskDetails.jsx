import axios from 'axios';
import React, { useContext, useState, useEffect } from 'react';
import { LuArrowLeft } from 'react-icons/lu';
import { authContext } from '../../Context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaCheckCircle } from "react-icons/fa";
import { RingLoader, ScaleLoader } from 'react-spinners';


const TaskDetails = () => {
    const location = useLocation();
  const { taskId , projectId , userData } = location.state || {};
  const [editing, setEditing] = useState(false);
  const { token } = useContext(authContext);
  const [task, setTask] = useState(null); // Initial null state
    const navigate = useNavigate()
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  // console.log(userData);
  

  async function getTask() {
    try {
      const response = await axios.get(`https://backend-production-574a.up.railway.app/api/v1/projects/${projectId}/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setTask(response.data.data.task);
      
    } catch (error) {
      toast.error(error.response.data.message);
      navigate("/dashboard")
      console.error(error);
    }
  }

  async function getComments() {
    try {
      const response = await axios.get(`https://backend-production-574a.up.railway.app/api/v1/projects/${projectId}/tasks/${taskId}/comments`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setComments(response.data.data.comments);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  async function addComment() {
    setCommentLoading(true)
    try {
      const response = await axios.post(
        `https://backend-production-574a.up.railway.app/api/v1/projects/${projectId}/tasks/${taskId}/comments`,
        { content: newComment },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      getComments()
      setNewComment('');
    } catch (error) {
      console.error(error);
    }
    setCommentLoading(false)
  }

  async function updateTask(values) {
    setEditLoading(true)
    
    try {
      const response = await axios.patch(
        `https://backend-production-574a.up.railway.app/api/v1/projects/${projectId}/tasks/${taskId}`,
        values,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      toast.success("Task updated successfully")
      setEditing(false)
      getTask()
    } catch (error) {
      console.error(error);
    }
    setEditLoading(false)
  }
  async function taskDone() {
    try {
      const response = await axios.patch(
        `https://backend-production-574a.up.railway.app/api/v1/projects/${projectId}/tasks/${taskId}/done`,
        {}, 
        {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
      // console.log(response.data);
      toast.success("Task marked as done!");
      getTask()
    } catch (error) {
      console.error("Error marking task as done:", error);
      toast.error(error.response?.data?.message || "Failed to complete task");
    }
  }

  useEffect(() => {
    getTask(); 
    getComments();
  }, []);

  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "",
    priority: "",
    dueDate: "",
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        status: task.status || "",
        priority: task.priority || "",
        dueDate: task.dueDate || "",
      });
    }
  }, [task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'dueDate' && value) {
      const date = new Date(value);
      setFormData({ ...formData, [name]: date.toISOString() });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in progress":
        return "bg-yellow-100 text-yellow-800";
      case "not started":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
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

  if (!task) {
    return (
      <div className="w-full h-[calc(100vh-75px)] flex justify-center items-center">
        <div className=""><RingLoader color="#3B82F6"/></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
    
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="border-b border-gray-200 p-6 flex justify-between items-center">
          {editing ? (
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="text-2xl font-bold w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          ) : (
            <h1 className="text-2xl font-bold text-gray-800">{task.title}</h1>
          )}
          <div className=" flex gap-4">
            
          {(userData?.id == task.creator.user.id || userData?.id == task.projectManager) ?  <button
            onClick={() => setEditing(!editing)}
            className="p-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition"
          >
            Edit
            </button>:""}
          {( (userData.id == task.member.user.id)) && (task.status!="FINISHED") ?  <button
            onClick={() => taskDone()}
            className="flex justify-center items-center gap-2 p-2 bg-green-100 text-green-500 rounded-md hover:bg-blue-200 transition"
          >
            Finish the Task <FaCheckCircle />
          </button>:""}
          

           
          
          </div>
          
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">Description</h2>
            {editing ? (
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full h-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter task description"
              />
            ) : (
              <p className="text-gray-600 whitespace-pre-line">{task.description || "No description provided"}</p>
            )}

            <div className="flex gap-20 mt-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-700 mb-3">Created by</h2>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                    <img src={task.creator.user.photo} alt="" className='rounded-full w-10 h-10' />
                  </div>
                  <div>
                    <p className="font-medium">{task.creator.user.username}</p>
                    <p className="text-sm text-gray-500">{task.member.role}</p>
                  </div>
                </div>
              </div>
              <div className=''>
                <h2 className="text-lg font-semibold text-gray-700 mb-3">Assigned To</h2>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                    <img src={task.member.user.photo} alt="" className='rounded-full h-10 w-10' />
                  </div>
                  <div>
                    <p className="font-medium">{task.member.user.username || 'Unassigned'}</p>
                    <p className="text-sm text-gray-500">{task.member.role}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Comments Section */}
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-700 mb-3">Comments</h2>
              <div className="space-y-4 mb-4 ">
                {comments.map(comment => (
                  <div key={comment.id} className="p-2  bg-gray-100 rounded-lg ">
                    <div className="flex items-center space-x-3 mb-2">
                      <img 
                        src={comment.user.photo} 
                        alt={comment.user.username} 
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <p className="font-medium">{comment.user.username}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(comment.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-700 ps-2 ">{comment.content}</p>
                  </div>
                ))}
              </div>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={addComment}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                >
                 {commentLoading ? (
                  <ScaleLoader width={2} height={10} color="#ffffff" />
                ) : (
                  "post"
                )}
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-3">Details</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  {editing ? (
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {/* <option value="Not Started">Not Started</option> */}
                      <option value="INPROGRESS">In Progress</option>
                      <option value="FINISHED">Completed</option>
                    </select>
                  ) : (
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Priority</h3>
                  {editing ? (
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                    </select>
                  ) : (
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Due Date</h3>
                  {editing ? (
                    <input
                      type="date"
                      name="dueDate"
                      value={formData.dueDate ? new Date(formData.dueDate).toISOString().split('T')[0] : ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-600">
                      {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No due date"}
                    </p>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Created At</h3>
                  <p className="text-gray-600">{new Date(task.createdAt).toLocaleDateString()}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Last Updated</h3>
                  <p className="text-gray-600">{new Date(task.updatedAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {editing && (
          <div className="border-t border-gray-200 p-4 flex justify-end space-x-3">
            <button
              onClick={() => setEditing(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button type='submit' onClick={()=>{updateTask(formData)}} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
              {editLoading ? (
                                <ScaleLoader width={2} height={10} color="#ffffff" />
                              ) : (
                                "Save Changes"
                              )}</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskDetails;