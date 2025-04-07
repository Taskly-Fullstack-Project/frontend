import React, { useState } from "react";

const ProjectDetails = () => {
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);

  // Mock data for design purposes only
  const project = {
    name: "Website Redesign",
    description: "Complete overhaul of company website with modern design and improved UX",
    createdAt: "2023-05-15",
    members: [
      { id: 1, name: "John Doe", role: "Frontend Developer" },
      { id: 2, name: "Jane Smith", role: "UI Designer" },
      { id: 3, name: "Mike Johnson", role: "Backend Developer" },
    ],
    tasks: [
      { id: 1, title: "Create wireframes", status: "Completed", assignedTo: "Jane Smith" },
      { id: 2, title: "Implement homepage", status: "In Progress", assignedTo: "John Doe" },
      { id: 3, title: "API integration", status: "Not Started", assignedTo: "Mike Johnson" },
    ]
  };

  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'not started':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const AddNewTaskModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="border-b border-gray-200 p-4">
          <h2 className="text-xl font-semibold text-gray-800">Add New Task</h2>
        </div>
        
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter task title"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Enter task description"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Select status</option>
              <option value="Not Started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Select team member</option>
              {project.members.map(member => (
                <option key={member.id} value={member.name}>
                  {member.name} ({member.role})
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div className="border-t border-gray-200 p-4 flex justify-end space-x-3">
          <button 
            onClick={() => setShowAddTaskModal(false)}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
            Add Task
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Original Project Details Component (unchanged) */}
      <div className="max-w-4xl mx-auto p-5 font-sans text-gray-800">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{project.name}</h1>
            <span className="text-gray-500 text-sm">Created on: {project.createdAt}</span>
          </div>
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
            Update Project
          </button>
        </div>
        
        <div className="mb-8 p-4 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-2 text-gray-700">Description</h2>
          <p className="text-gray-600">{project.description}</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/3">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-700">Team Members</h2>
              <button className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition">
                Add Member
              </button>
            </div>
            <ul className="space-y-3">
              {project.members.map(member => (
                <li key={member.id} className="group p-3 bg-gray-50 rounded flex justify-between items-center">
                  <div>
                    <span className="font-medium">{member.name}</span>
                    <span className="block text-gray-500 text-sm">{member.role}</span>
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 px-2 py-1 bg-red-100 text-red-600 rounded text-xs hover:bg-red-200 transition">
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="md:flex-1">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-700">Tasks</h2>
              <button 
                onClick={() => setShowAddTaskModal(true)}
                className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition"
              >
                Add New Task
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg overflow-hidden">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-3 px-4 text-left text-gray-700 font-medium">Title</th>
                    <th className="py-3 px-4 text-left text-gray-700 font-medium">Status</th>
                    <th className="py-3 px-4 text-left text-gray-700 font-medium">Assigned To</th>
                    <th className="py-3 px-4 text-left text-gray-700 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {project.tasks.map(task => (
                    <tr key={task.id}>
                      <td className="py-3 px-4">{task.title}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                          {task.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">{task.assignedTo}</td>
                      <td className="py-3 px-4">
                        <button className="px-2 py-1 bg-blue-100 text-blue-600 rounded text-xs hover:bg-blue-200 transition mr-2">
                          Update
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Conditionally render the Add Task Modal */}
      {showAddTaskModal && <AddNewTaskModal />}
    </>
  );
};

export default ProjectDetails;





 // <div className="flex justify-center items-center">
  //         <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
  //         Update Project
  //       </button>
  //       <button
  //                 className="text-white bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition mx-4"
  //                 onClick={() => {
  //                   // delProject(project.id);
  //                 }}
  //               >
  //                 <LuTrash size={20} /> 
  //               </button>
  //       </div>