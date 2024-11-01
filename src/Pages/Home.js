import React, { useEffect } from "react";
import Navbar from "../Components/Navbar";
import Sidebar from "../Components/Sidebar";
import {
  faDollarSign,
  faHandHoldingDollar,
  faMoneyBillTrendUp,
  faSackDollar,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "../Firebase";

function Home() {
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
    <div className="home">
      <Sidebar />
      <div className="container">
        <Navbar />
        <div className="box1">
          <div className="left-half">
            <h4>Sales Overview</h4>
            <div className="cubes">
              <div className="uno">
                <FontAwesomeIcon className="cup" icon={faSackDollar} />
                <p className="total">Total Sales</p>
                <p className="bold">90768</p>
              </div>
              <div className="dos">
                <FontAwesomeIcon className="cup" icon={faMoneyBillTrendUp} />
                <p className="total">Revenue</p>
                <p className="bold">1571</p>
              </div>
              <div className="tres">
                <FontAwesomeIcon className="cup" icon={faDollarSign} />
                <p className="total">Cost</p>
                <p className="bold">13671</p>
              </div>
              <div className="quatro">
                <FontAwesomeIcon className="cup" icon={faHandHoldingDollar} />
                <p className="total">Profit</p>
                <p className="bold">2763</p>
              </div>
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
            <p>
              food <span>5654</span>
            </p>
            <hr />
            <p>
              food <span>5654</span>
            </p>
            <hr />
            <p>
              food <span>5654</span>
            </p>
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
