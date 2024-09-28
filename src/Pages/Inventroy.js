import React from "react";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFilePen,
  faPaperPlane,
  faPrint,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";

function Inventroy() {
  return (
    <div className="inventory">
      <Sidebar />
      <div className="content">
        <Navbar />
        <div className="title">
          <div className="small-top">
            <h4>Inventory</h4>
            <button className="sendReport">
              <FontAwesomeIcon className="log" icon={faPaperPlane} />
            </button>
            <button className="print">
              <FontAwesomeIcon className="log" icon={faPrint} />
            </button>
          </div>
        </div>
        <table className="table">
          <tr>
            <th className="grey">Item Code</th>
            <th className="grey">Item Name</th>
            <th className="grey">Item Group</th>
            <th className="grey">Last Purchase</th>
            <th className="grey">On Hand</th>
            <th className="grey">Actions</th>
          </tr>
          <tr>
            <td className="light">V7382</td>
            <td className="light">Broccoli</td>
            <td className="light">Vegetable</td>
            <td className="light">03 May 2021</td>
            <td className="light">10kgs</td>
            <td className="light">
              <button className="edit">
                <FontAwesomeIcon className="btns blue" icon={faFilePen} />
              </button>
              <button className="delete">
                <FontAwesomeIcon className="btns red" icon={faTrashCan} />
              </button>
            </td>
          </tr>
        </table>
      </div>
    </div>
  );
}

export default Inventroy;
