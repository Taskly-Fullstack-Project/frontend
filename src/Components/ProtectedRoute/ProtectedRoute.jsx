import React from 'react'
import { Navigate } from 'react-router-dom'

function ProtectedRoute({children}) {

    if(localStorage.getItem("token") == null)
    {
        return <Navigate to={"/login"} />
    }
  return (
    <div>
      {children}
    </div>
  )
}

export default ProtectedRoute
