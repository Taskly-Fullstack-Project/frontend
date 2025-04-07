import React, { use, useState } from 'react'
import { HiOutlineMenu, HiOutlineX } from 'react-icons/hi'
import SideMenu from '../SideMenu/SideMenu'
import logo from "./../../assets/images/logo4.png";

function Navbar({activeMenu}) {
    const [sideMenu,setSideMenu] = useState(false)
  return (
//   <></>
    <div className=' flex border border-b gap-5  border-gray-200/50 backdrop-blur-[2px] py-4  px-7 sticky top-0 z-30'>
      <button
      className='lg:hidden text-black block'
      onClick={()=>{setSideMenu(!sideMenu)}}>
        {sideMenu?(
            <HiOutlineX className='text-2xl'/>
        ):(
            <HiOutlineMenu className="text-2xl"/>
        )}
        </button>
        <h3 className='font-medium text-black text-2xl'><img src={logo} alt=""  className='w-20'/></h3>
        {sideMenu && (
            <div className="fixed top-[60px] -ml-8 bg-white lg:hidden">
                <SideMenu activeMenu={activeMenu}/>
            </div>
        )}
    </div>
  )
}

export default Navbar
