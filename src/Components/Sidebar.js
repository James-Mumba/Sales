import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { app } from "../Firebase";

function Sidebar() {
  const navigate = useNavigate();
  const auth = getAuth(app);

  function out() {
    signOut(auth)
      .then(() => {
        navigate("/Signin");
      })
      .catch((error) => {
        const errorMessage = error.message;
        console.log(errorMessage);
      });
  }
  return (
    <div className="sidebar">
      <div className="logo"></div>
      <Link className="click" to={"/Home"}>
        Home
      </Link>
      <Link className="click" to={"/Inventroy"}>
        Inventory
      </Link>
      <Link className="click" to={"/Requisition"}>
      Cafe Requisition
      </Link>
      <Link className="click" to={"/Sales"}>
        Sales
      </Link>
      <Link className="click" to={""}>
        Option
      </Link>

      <button className="out" onClick={out}>
        Log Out
      </button>
    </div>
  );
}

export default Sidebar;
