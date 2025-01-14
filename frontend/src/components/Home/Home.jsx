import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
function Home() {
   const loggedin = useSelector((state) => state.auth.loggedin);
   const navigate = useNavigate();

   useEffect(() => {
      if (!loggedin) {
         navigate("/login");
      } else {
         // navigate("/habit");
      }
   }, []);
   return <div></div>;
}

export default Home;
