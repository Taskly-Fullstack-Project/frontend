import React from 'react'

function InfoCard({icon,label,value,color}) {
  return (
    <div className='flex items-center gap-3'>
      <div className="w-2 md:w-2 h-3 md:h-5 bg-blue-500 rounded-full"></div>
        <p className='text-xs md:text-[14px] text-gray-500'><span className='text-sm md:text-[15px] me-1 text-black font-semibold'>{value}</span>{label}</p>
      
    </div>
  )
}

export default InfoCard
