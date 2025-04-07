import moment from 'moment';
import React from 'react'

function Tasks() {

    const statusBadge = (s)=>{
        switch(s){
            case "completed" : return 'bg-green-100 text-green-500 border border-green-200';
            case "In progress":return'bg-cyan-100 text-cyan-500 border border-cyan-200';
            default:return 'bg-gray-100 text-gray-500 border border-gray-200';
        }
    }
    const priorityBadge = (s)=>{
        switch(s){
            case 'high':return 'bg-red text-red-500 border border-red-200';
            case 'medium':return 'bg-orange text-orange-500 border border-orange-200';
            case 'low':return 'bg-green text-green-500 border border-green-200';
            default:return 'bg-gray text-gray-500 border border-gray-200';


        }
    }
  return (
    <div>
      <div className="overflow-x-auto p-0 rounded-lg mt-3">
        <table className='min-w-full'>
          <thead>
            <tr className='text-center'>
              <th className='py-3 px-4 text-gray-800 font-medium text-[13px]'>Name</th>
              <th className='py-3 px-4 text-gray-800 font-medium text-[13px]'>Status</th>
              <th className='py-3 px-4 text-gray-800 font-medium text-[13px]'>Priority</th>
              <th className='py-3 px-4 text-gray-800 font-medium text-[13px] hidden md:table-cell'>Created AT</th>
            </tr>
          </thead>
          <tbody>
          <tr className='border-t border-gray-200 text-center'>
              <td className='my-3 mx-4 text-gray-700 text=[13px] line-clamp-1 overflow-hidden'>new task</td>
              <td className='py-4 px-4'>
                <span className='px-2 py-1 text-xs rounded inline-block bg-green-400'>completed</span>
                </td>
              <td className='py-4 px-4'>
                <span className='px-2 py-1 text-xs rounded inline-block bg-red-500'>high</span>
                </td>
              <td className='py-4 px-4 text-gray-700 text-[13px] text-nowrap hidden md:table-cell'>{moment().format("Do MMM YYYY")}</td>
              </tr>
              
          </tbody>
        </table>
        
      </div>
    </div>
  )
}

export default Tasks
