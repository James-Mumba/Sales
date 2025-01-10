import React, { useEffect, useState } from "react";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";
import { Carousel } from "react-bootstrap";
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  orderBy,
  deleteDoc,
  limit,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../Firebase";

function Boss({ queriedSales, onDismiss }) {
  const [queriedSalesList, setQueriedSales] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [loadingBestSellers, setLoadingBestSellers] = useState(true);

  //best seller
  const fetchBestSellers = async () => {
    setLoadingBestSellers(true);
    try {
      const salesCollection = collection(db, "Sales-Data");
      where("status", "==", "paid");
      const q = query(salesCollection, orderBy("price", "desc"), limit(5));
      const querySnapshot = await getDocs(q);
      const bestSellerData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      bestSellerData.sort((a, b) => b.price * b.pieces - a.price * a.pieces);
      setBestSellers(bestSellerData);
    } catch (error) {
      console.error("Error fetching best seller:", error);
    } finally {
      setLoadingBestSellers(false);
    }
  };

  //fetch every 30 mins
  useEffect(() => {
    fetchBestSellers();
    const interval = setInterval(() => {
      fetchBestSellers();
    }, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleRefreshBestSellers = () => {
    fetchBestSellers();
  };

  //fetching queried sales data
  useEffect(() => {
    const fetchQueriedData = async () => {
      try {
        const queriedSalesCollection = collection(db, "queried_sales");
        const querySnapshot = await getDocs(queriedSalesCollection);
        const queriedData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setQueriedSales(queriedData);
      } catch (error) {
        console.error("Error fetching queried sales:", error);
        setQueriedSales([]);
      }
    };

    fetchQueriedData();
  }, []);

  useEffect(() => {
    const queriedSalesCollection = collection(db, "queried_sales");
    const q = query(queriedSalesCollection, orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const queriedData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      // console.log("Queried sales data:", queriedData);
      setQueriedSales(queriedData);
    });

    return () => unsubscribe();
  }, []);

  const handleDismiss = async (sale) => {
    try {
      const queriedDocRef = doc(db, "queried_sales", sale.id);
      await deleteDoc(queriedDocRef);
      if (sale.saleDetails && sale.saleDetails.saleId) {
        const saleDocRef = doc(db, "sales", sale.saleDetails.saleId);
        await updateDoc(saleDocRef, {
          status: "active",
        });
      }
      setQueriedSales((prev) => prev.filter((item) => item.id !== sale.id));
      onDismiss(sale.id);
    } catch (error) {
      console.error("Error dismissing query:", error);
    }
  };

  const handleDelete = async (sale) => {
    try {
      console.log("Delete button clicked for:", sale);
      const salesDataId = sale.saleDetails?.saleId;
      if (!salesDataId) {
        console.error("Sales-Data document ID not found in sale details.");
        return;
      }
      console.log("Attempting to delete document with ID:", salesDataId);
      const salesDocRef = doc(db, "Sales-Data", salesDataId);
      console.log("Document Reference:", salesDocRef);
      await deleteDoc(salesDocRef);
      setQueriedSales((prev) => prev.filter((item) => item.id !== sale.id));
      console.log(`Successfully deleted document with ID: ${salesDataId}`);
    } catch (error) {
      console.error("Error deleting document:", error.message);
      console.error("Full error details:", error);
    }
  };

  return (
    <div className="boss">
      <Sidebar />
      <div className="bar">
        <Navbar />
        <div className="down-low">
          <div className="center_piece">
            <Carousel>
              <Carousel.Item>
                <img
                  className="d-block w-100"
                  src="https://image.slidesdocs.com/responsive-images/background/money-abundance-personified-in-a-3d-rendering-of-falling-golden-coins-powerpoint-background_8954537fb8__960_540.jpg"
                  alt=""
                />
              </Carousel.Item>
              <Carousel.Item>
                <img
                  className="d-block w-100"
                  src="https://www.pnbmetlife.com/content/dam/pnb-metlife/images/articles/savings/factors-affecting-financial-planning.jpg"
                  alt=""
                />
              </Carousel.Item>
              <Carousel.Item>
                <img
                  className="d-block w-100"
                  src="https://thumbs.dreamstime.com/b/fairytale-mood-foggy-forest-autumn-mystical-sunlight-illuminating-fog-behind-tree-trunks-wide-panorama-335507638.jpg"
                  alt=""
                />
              </Carousel.Item>
            </Carousel>
          </div>
          <div className="cubed">
            <div className="sized one">
              <div className="earnings">Earnings</div>
              <div className="Queries">
                <div className="q-title">
                  <h5>Recent Queries</h5>
                </div>
                <div className="q-content">
                  {Array.isArray(queriedSalesList) &&
                  queriedSalesList.length > 0 ? (
                    queriedSalesList.map((sale) => (
                      <div key={sale.id} className="q-contenthead">
                        <p className="big" id="customer">
                          {sale.saleDetails?.Name || "Unknown Customer"}
                        </p>
                        <p id="item">
                          {sale.saleDetails?.item || "Unknown Item"}
                        </p>
                        <p id="pieces">
                          {sale.saleDetails?.pieces || "N/A"}ptn
                        </p>
                        <button
                          className="no-error"
                          onClick={() => handleDismiss(sale)}
                        >
                          Dismiss
                        </button>
                        <button
                          className="del"
                          onClick={() => handleDelete(sale)}
                        >
                          Delete
                        </button>
                      </div>
                    ))
                  ) : (
                    <p>No queried sales available.</p>
                  )}
                </div>
              </div>
            </div>
            <div className="sized two">
              <div className="books">
                <div className="bookstitle">
                  <h6>Best Seller</h6>
                  <button
                    className="cash-in"
                    onClick={handleRefreshBestSellers}
                  >
                    Earnings
                  </button>
                </div>
                <div className="holder">
                  {loadingBestSellers ? (
                    <p>Loading best sellers...</p>
                  ) : bestSellers.length > 0 ? (
                    bestSellers.map((bestSeller) => (
                      <div key={bestSeller.id} className="booklist-item">
                        <p className="p item">{bestSeller.item}</p>
                        <p className="sellername">{bestSeller.pieces} ptns</p>
                        <p className="p">
                          <span className="color total">
                            {(
                              bestSeller.price * bestSeller.pieces
                            ).toLocaleString("en-US", {
                              style: "currency",
                              currency: "ksh",
                            })}
                          </span>
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="nobest">No best sellers available.</p>
                  )}
                </div>
              </div>
              <div className="sales2day">
                <div className="blogstitle">Recent Blogs</div>
                <div className="blogposts">
                  <div className="blog-container">
                    <h6 className="bloghead">Why Save Money?</h6>
                    <p className="blogdate">
                      <small>19/08/2024</small>
                    </p>
                    <p className="blogtext">
                      <small>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Amet nemo repellendus distinctio eveniet eaque eligendi,
                        natus laudantium quae quaerat. Tempora, aspernatur amet
                        nulla animi corrupti vel incidunt sequi sint
                        exercitationem!
                      </small>
                    </p>
                    <p className="blogname">
                      <small>john white</small>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Boss;
