import React, { useEffect } from "react";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "../Firebase";

function Restock() {
  const navigate = useNavigate();
  const auth = getAuth(app);

  useEffect(() => {
    const vamos = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/Signin");
      }
    });
    return () => vamos();
  }, [auth, navigate]);

  return (
    <div className="Restock">
      <Sidebar />
      <div className="can">
        <Navbar />
        <div className="arm-left">1</div>
        <div className="arm-right">2</div>
        <div className="arm-right">3</div>
      </div>
    </div>
  );
}

export default Restock;
