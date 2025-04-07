import React, { createContext, useEffect, useState } from "react";

export const authContext = createContext();
function AuthContextProvider({ children }) {
  const [token, settoken] = useState(null);
  

  useEffect(function () {
    if (localStorage.getItem("token")) {
      settoken(localStorage.getItem("token"));
    }
  }, []);

  return (
    <authContext.Provider value={{ token, settoken }}>
      {children}
    </authContext.Provider>
  );
}

export default AuthContextProvider;
