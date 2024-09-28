import { faBell, faGear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

function Navbar() {
  return (
    <div className="navbar">
      <div className="tafuta">
        <input type="search" name="" id="search" placeholder="Search here" />
        <button className="search" type="submit">
          search
        </button>
      </div>
      <div className="buttons">
        <button className="notification">
          <FontAwesomeIcon className="log" icon={faBell} />
        </button>
        <button className="settings">
          <FontAwesomeIcon className="log" icon={faGear} />
        </button>
      </div>
      <div className="profileP">
        <div className="pic"></div>
        <p className="userName">User Name</p>
      </div>
    </div>
  );
}

export default Navbar;
