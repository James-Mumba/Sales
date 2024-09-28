import React from "react";
import Navbar from "../Components/Navbar";
import Sidebar from "../Components/Sidebar";

function Home() {
  return (
    <div className="home">
      <Sidebar />
      <div className="container">
        <Navbar />
        <div className="box1">
          <div className="left-half">
            <h4>Sales Overview</h4>
            <div className="cubes">
              <div className="uno">1</div>
              <div className="dos">2</div>
              <div className="tres">3</div>
              <div className="quatro">4</div>
            </div>
          </div>
          <div className="right-half">
            <h4>Purchase Overview</h4>
            <div className="cubes">
              <div className="uno">1</div>
              <div className="dos">2</div>
              <div className="tres">3</div>
              <div className="quatro">4</div>
            </div>
          </div>
        </div>
        <div className="box2">
          <div className="inventory-Summary">
            <p>Inventory Summary</p>
            <div className="numb">
              <div className="amnt">1</div>
              <div className="amnt">2</div>
            </div>
          </div>
          <div className="Product-details">
            <p>Product Details</p>
            <p>food <span>5654</span></p>
            <hr />
            <p>food <span>5654</span></p>
            <hr />
            <p>food <span>5654</span></p>
            <hr />
            <p>food <span>5654</span></p>
            <hr />
          </div>
          <div className="No-of-Users">
            <p>No. of Users</p>
            <div className="numb">
              <div className="amnt">1</div>
              <div className="amnt">2</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
