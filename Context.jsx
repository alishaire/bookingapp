import React, { createContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
export let SessionProvider = createContext();
const Context = ({ children }) => {
  const [user, setUser] = useState();
  const router = useRouter();
  const pathname = router.pathname;
 const fetchUser = async ()=>{
    try {
        const res = await axios.get("/api/user/profile")
       
        setUser(res.data.message);
    } catch (error) {
        console.log(error)
    }
 }
 useEffect(() => {
 fetchUser()
 }, [pathname])

  return (
    <SessionProvider.Provider value={{ user, setUser}} >
      {children}
    </SessionProvider.Provider>
  );
};

export default Context;
