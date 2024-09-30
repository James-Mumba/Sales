import React from "react";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";

function Restock() {
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
