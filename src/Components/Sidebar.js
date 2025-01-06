// import React from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { getAuth, signOut } from "firebase/auth";
// import { app } from "../Firebase";

// function Sidebar() {
//   const auth = getAuth(app);
//   const navigate = useNavigate();

//   function out() {
//     signOut(auth)
//       .then(() => {
//         navigate("/Signin");
//       })
//       .catch((error) => {
//         console.log(error.message);
//       });
//   }

//   return (
//     <div className="sidebar">
//       <div className="logo"></div>
//       <Link className="click" to={"/Home"}>
//         Home
//       </Link>
//       <Link className="click" to={"/Inventroy"}>
//         Inventory
//       </Link>
//       <Link className="click" to={"/Sales"}>
//         Sales
//       </Link>
//       <Link className="click" to={"/Boss"}>
//         Admin
//       </Link>
//       <Link className="click" to={"/Records"}>
//         Records
//       </Link>
//       <button className="out" onClick={out}>
//         Log Out
//       </button>
//     </div>
//   );
// }

// export default Sidebar;

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { app } from "../Firebase";

function Sidebar() {
  const auth = getAuth(app);
  const navigate = useNavigate();

  // const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const ADMIN_PASSWORD = "admin123";

  // Handle log out
  function out() {
    signOut(auth)
      .then(() => {
        navigate("/Signin");
      })
      .catch((error) => {
        console.log(error.message);
      });
  }

  // Handle access to the Admin page (Boss)
  const handleAdminClick = () => {
    const enteredPassword = prompt("Enter Admin Password: ");

    if (enteredPassword === ADMIN_PASSWORD) {
      navigate("/Boss");
    } else {
      setError("Incorrect password!");
    }
  };

  return (
    <div className="sidebar">
      <div className="logo"></div>
      <Link className="click" to={"/Home"}>
        Home
      </Link>
      <Link className="click" to={"/Inventroy"}>
        Inventory
      </Link>
      <Link className="click" to={"/Sales"}>
        Sales
      </Link>

      <button className="click" onClick={handleAdminClick}>
        Admin
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <Link className="click" to={"####"}>
        Records
      </Link>
      <button className="out" onClick={out}>
        Log Out
      </button>
    </div>
  );
}

export default Sidebar;
