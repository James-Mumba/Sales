// import React, { useEffect, useRef } from "react";
// import Sidebar from "../Components/Sidebar";
// import Navbar from "../Components/Navbar";
// import Table from "react-bootstrap/Table";
// import { Form } from "react-bootstrap";
// import { useState } from "react";
// import Button from "react-bootstrap/Button";
// import Modal from "react-bootstrap/Modal";
// import { getAuth, onAuthStateChanged } from "firebase/auth";
// import { app, db } from "../Firebase";
// import { useNavigate } from "react-router-dom";
// import {
//   collection,
//   deleteDoc,
//   doc,
//   getDocs,
//   query,
//   setDoc,
//   updateDoc,
//   where,
// } from "firebase/firestore";
// import { jsPDF } from "jspdf";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";

// function Sales() {
//   const auth = getAuth(app);
//   const navigate = useNavigate();

//   const [user, setUser] = useState(null);
//   const [isAdmin /* setIsAdmin*/] = useState(false);

//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, (currentUser) => {
//       if (currentUser) {
//         setUser(currentUser);
//         const fetchSalesData = async () => {
//           const q = query(
//             collection(db, "Sales-Data"),
//             where("userId", "==", currentUser.uid)
//           );
//           const querySnapshot = await getDocs(q);
//           const fetchedSales = querySnapshot.docs.map((doc) => ({
//             id: doc.id,
//             ...doc.data(),
//           }));
//           setSales(fetchedSales);
//           calculatePaidTotals(fetchedSales);
//         };
//         fetchSalesData();
//       } else {
//         navigate("/Signin");
//       }
//     });

//     return () => unsub();
//   }, [auth, navigate]);

//   useEffect(() => {
//     if (!user) return;

//     const fetchData = async () => {
//       const q = query(
//         collection(db, "Sales-Data"),
//         where("userId", "==", user.uid)
//       );
//       let saleItems = [];
//       const querySnapshot = await getDocs(q);
//       querySnapshot.forEach((salesDoc) => {
//         saleItems.push({ id: salesDoc.id, ...salesDoc.data() });
//       });
//       setSales(saleItems);
//     };
//     fetchData();
//   }, [user]);

//   //query sales

//   const handleQuery = async (id) => {
//     try {
//       const saleToQuery = sales.find((sale) => sale.id === id);
//       if (!saleToQuery) return;

//       const queriedDocRef = doc(collection(db, "queried_sales"));
//       await setDoc(queriedDocRef, {
//         saleId: id,
//         saleDetails: saleToQuery,
//         timestamp: new Date(),
//       });

//       setQueriedItems((prev) => {
//         const updatedQueries = [...prev, id];
//         localStorage.setItem("queriedItems", JSON.stringify(updatedQueries));
//         return updatedQueries;
//       });
//       console.log("Sale queried successfully!");
//     } catch (error) {
//       console.error("Error querying sale:", error);
//     }
//   };

//   const [show, setShow] = useState(false);
//   const [sales, setSales] = useState([]);
//   const [selectedItem, setSelectedItem] = useState("");
//   const [price, setPrice] = useState(0);
//   const [quantity, setQuantity] = useState(1);
//   const [amountDue, setAmountDue] = useState(0);
//   const [totalPaidCount, setTotalPaidCount] = useState(0);
//   const [totalPaidAmount, setTotalPaidAmount] = useState(0);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [itemToDelete] = useState(null);
//   const [queriedItems, setQueriedItems] = useState(() => {
//     const savedQueries = localStorage.getItem("queriedItems");
//     return savedQueries ? JSON.parse(savedQueries) : [];
//   });

//   const itemRef = useRef();
//   const numberOfPcsRef = useRef();
//   const priceRef = useRef();
//   const customerRef = useRef();
//   const amountDueRef = useRef();

//   const itemsPrices = {
//     "Sirloin Steak": 1070,
//     "Ribeye Steak": 2180,
//     "Rump Steak": 1350,
//     "T-Bone Steak": 1670,
//     "Chuck Bone-in": 870,
//     "T-Bone Steak with Accompaniments": 2170,
//     "Rump Steak with Accompaniments": 1850,
//     "Ribeye Steak with Accompaniments": 2680,
//     "Steak with Accompaniments": 1570,
//     "Chuck Bone-in with Accompaniments": 1370,
//     "Choma Sausages pack": 2450,
//     "Choma Sausage 2@": 350,
//     "Burger Patti 1@": 220,
//     "Beef Samosa": 75,
//     "Omellete ": 150,
//     "Omellete, Tea/ Coffee": 400,
//     "Tea/ Coffee": 250,
//   };

//   const handleClose = () => setShow(false);
//   const handleShow = () => setShow(true);
//   const handleCloseDelete = () => setShowDeleteModal(false);
//   const handleShowDelete = () => setShowDeleteModal(true);

//   const handleItemChange = (e) => {
//     const selected = e.target.value;
//     setSelectedItem(selected);
//     const selectedPrice = itemsPrices[selected] || 0;
//     setPrice(selectedPrice);
//     setAmountDue(selectedPrice * quantity);
//   };

//   const handleQuantityChange = (e) => {
//     const qty = parseInt(e.target.value);
//     setQuantity(qty);
//     setAmountDue(price * qty);
//   };

//   useEffect(() => {
//     onAuthStateChanged(auth, (user) => {
//       if (user) {
//         const fetchData = async () => {
//           const q = query(
//             collection(db, "Sales-Data"),
//             where("userId", "==", user.uid)
//           );
//           let saleItems = [];
//           const querySnapshot = await getDocs(q);

//           querySnapshot.forEach(async (salesDoc) => {
//             const data = { id: salesDoc.id, ...salesDoc.data() };
//             saleItems.push(data);
//           });
//           setSales(saleItems);
//           calculatePaidTotals(saleItems);
//         };
//         fetchData();
//       }
//     });
//   }, [auth]);

//   const calculatePaidTotals = (salesData) => {
//     const paidSales = salesData.filter((sale) => sale.status === "Paid");
//     const count = paidSales.length;
//     const totalAmount = paidSales.reduce((acc, sale) => acc + sale.debt, 0);
//     setTotalPaidCount(count);
//     setTotalPaidAmount(totalAmount);
//   };

//   async function handleSale(selectedItems, portionsSold) {
//     const salesDate = new Date().toLocaleString();
//     try {
//       const inventorySnapshot = await getDocs(
//         collection(db, "store-Inventory")
//       );
//       let matchedItems = [];
//       inventorySnapshot.forEach((doc) => {
//         const inventoryItem = doc.data();
//         const inventoryProductName = inventoryItem.Product.toLowerCase();
//         const isMatch = selectedItems.some((selected) => {
//           const selectedItemName = selected.toLowerCase();
//           const selectedWords = selectedItemName.split(" ");
//           return (
//             inventoryProductName.includes(selectedItemName) ||
//             inventoryProductName.includes(
//               selectedWords.slice(0, 1).join(" ")
//             ) ||
//             (selectedWords.length > 1 &&
//               inventoryProductName.includes(
//                 selectedWords.slice(0, 2).join(" ")
//               ))
//           );
//         });
//         if (isMatch) {
//           matchedItems.push({ id: doc.id, ...inventoryItem });
//         }
//       });

//       if (matchedItems.length >= 1) {
//         for (const item of matchedItems) {
//           if (item.Portion >= portionsSold) {
//             const newPortionCount = item.Portion - portionsSold;
//             const docRef = doc(db, "store-Inventory", item.id);
//             await updateDoc(docRef, {
//               Portion: newPortionCount,
//             });
//             await sendNotification(item.Product, salesDate);
//           } else {
//             alert(`Not enough portions for ${item.Product}`);
//           }
//         }
//       }
//     } catch (error) {
//       console.error("Error selling items:", error.message);
//     }
//   }

//   async function sendNotification(itemName, salesDate) {
//     const notificationData = {
//       title: "Item Sold",
//       item: itemName,
//       date: salesDate,
//     };

//     const notificationDoc = doc(collection(db, "inventory-notifications"));
//     await setDoc(notificationDoc, notificationData);
//   }

//   const upload = () => {
//     const selectedItem = itemRef.current.value;
//     const pieces = numberOfPcsRef.current.value;
//     const price = priceRef.current.value;
//     const customersName = customerRef.current.value;
//     const amountDue = pieces * price;
//     const date = new Date();

//     onAuthStateChanged(auth, (user) => {
//       if (user) {
//         const userId = user.uid;
//         const newSales = doc(collection(db, "Sales-Data"));
//         const saleData = {
//           userId: userId,
//           item: selectedItem,
//           pieces: quantity,
//           price: price,
//           Name: customersName,
//           debt: amountDue,
//           date: date.toISOString(),
//           status: "Open",
//         };

//         setDoc(newSales, saleData, { merge: true })
//           .then(() => {
//             setSales((prevSales) => [
//               ...prevSales,
//               { id: newSales.id, ...saleData },
//             ]);
//             handleClose();
//             handleSale([selectedItem], pieces);
//           })
//           .catch((error) => console.log(error.message));
//       }
//     });
//   };

//   useEffect(() => {
//     const checkForOverdueSales = async () => {
//       const currentTime = new Date();

//       const updatedSales = await Promise.all(
//         sales.map(async (sale) => {
//           if (
//             sale.status === "Open" &&
//             currentTime - new Date(sale.date) > 1 * 60 * 1000 // 1 minute
//           ) {
//             const updatedSale = { ...sale, status: "Overdue" };
//             await updateDoc(doc(db, "Sales-Data", sale.id), {
//               status: "Overdue",
//             });
//             return updatedSale;
//           }
//           return sale;
//         })
//       );

//       setSales(updatedSales);
//     };

//     const intervalId = setInterval(checkForOverdueSales, 1 * 60 * 1000);
//     return () => clearInterval(intervalId);
//   }, [sales]);

//   const handlePaymentReceived = async (id) => {
//     const saleToUpdate = sales.find((sale) => sale.id === id);

//     if (saleToUpdate) {
//       const updatedSale = {
//         ...saleToUpdate,
//         status: "Paid",
//         paymentReceived: true,
//       };

//       await setDoc(doc(db, "Sales-Data", id), updatedSale, { merge: true });

//       setSales((prevSales) =>
//         prevSales.map((sale) => (sale.id === id ? updatedSale : sale))
//       );

//       setTimeout(() => {
//         generatePDF(updatedSale);
//       }, 1 * 60 * 1000);
//     }
//   };

//   const deleteEntry = async (id) => {
//     try {
//       await deleteDoc(doc(db, "Sales-Data", id));
//       setSales((prevSales) => prevSales.filter((sale) => sale.id !== id));
//       handleCloseDelete();
//     } catch (error) {
//       console.error("Error deleting document:", error.message);
//     }
//   };

//   const generatePDF = (saleData) => {
//     if (!saleData) return;

//     const doc = new jsPDF();
//     doc.text(`Item Sold: ${saleData.item || "Unknown Item"}`, 10, 10);
//     doc.text(`Customer Name: ${saleData.Name || "Unknown Customer"}`, 10, 20);
//     doc.text(`Amount Due: ${saleData.debt || 0}`, 10, 30);
//     doc.text(`Status: ${saleData.status || "Unknown"}`, 10, 40);

//     if (saleData.status === "Paid") {
//       doc.text("PAID", 50, 50);
//     }

//     doc.save(`Sale_${saleData.id}.pdf`);
//   };

//   return (
//     <div className="sales">
//       <Sidebar />
//       <div className="content">
//         <Navbar />
//         <div className="pay-page">
//           <div className="paid">
//             <p>
//               <span className="painNumber">{totalPaidCount}</span>Paid
//             </p>
//             <p>
//               Total Sales Ksh
//               <span className="paidTotal"> {totalPaidAmount}</span>
//             </p>
//           </div>
//         </div>
//         <Button variant="primary" className="mb" onClick={handleShow}>
//           Purchase
//         </Button>

//         <Modal
//           show={show}
//           onHide={handleClose}
//           backdrop="static"
//           keyboard={false}
//         >
//           <Modal.Header closeButton>
//             <Modal.Title>New Sale</Modal.Title>
//           </Modal.Header>
//           <Modal.Body>
//             <div className="wrap">
//               <label htmlFor="">Item Sold</label>
//               <Form.Select
//                 value={selectedItem}
//                 className="select"
//                 onChange={handleItemChange}
//                 ref={itemRef}
//               >
//                 <option disabled value="">
//                   Select an item
//                 </option>
//                 {Object.keys(itemsPrices).map((item) => (
//                   <option key={item} value={item}>
//                     {item}
//                   </option>
//                 ))}
//               </Form.Select>
//               <label htmlFor="">Number of pieces sold</label>
//               <input
//                 type="number"
//                 value={quantity}
//                 onChange={handleQuantityChange}
//                 ref={numberOfPcsRef}
//                 name=""
//                 id="numberOfPcs"
//                 placeholder="2 pcs"
//               />
//               <label htmlFor="Price">Price</label>
//               <input
//                 type="number"
//                 ref={priceRef}
//                 value={price}
//                 name=""
//                 id="Price"
//                 placeholder="Price Per Piece"
//               />
//               <label htmlFor="Customers Name">Customers Name</label>
//               <input
//                 type="text"
//                 ref={customerRef}
//                 name=""
//                 id="customersName"
//                 placeholder="John Jones"
//               />
//               <label htmlFor="amountDue">Amount Due</label>
//               <input
//                 disabled
//                 value={amountDue}
//                 type="number"
//                 ref={amountDueRef}
//                 name=""
//                 id="amountDue"
//                 placeholder="ksh 0.00"
//               />
//             </div>
//           </Modal.Body>
//           <Modal.Footer>
//             <Button variant="secondary" onClick={handleClose}>
//               Close
//             </Button>
//             <Button variant="primary" onClick={upload}>
//               Sell
//             </Button>
//           </Modal.Footer>
//         </Modal>
//         <Table striped bordered hover className="meza">
//           <thead>
//             <tr>
//               <th>#</th>
//               <th>Date</th>
//               <th>Item Sold</th>
//               <th>No. of Pcs</th>
//               <th>Price/Piece</th>
//               <th>Customer's Name'</th>
//               <th>Amount Due</th>
//               <th>Status</th>
//               {isAdmin && <th>Edit Data</th>} {/*if user is admin */}
//               <th>Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {sales.map((salesDoc, index) => (
//               <tr
//                 key={salesDoc.id}
//                 className={
//                   queriedItems.includes(salesDoc.id)
//                     ? "row-queried"
//                     : "row-default"
//                 }
//                 style={{
//                   backgroundColor: queriedItems.includes(salesDoc.id)
//                     ? "grey"
//                     : "white",
//                   color: queriedItems.includes(salesDoc.id)
//                     ? "lightgrey"
//                     : "black",
//                 }}
//               >
//                 <td>{index + 1}</td>
//                 <td>{new Date(salesDoc.date).toLocaleDateString("en-GB")}</td>
//                 <td>{salesDoc.item}</td>
//                 <td>{salesDoc.pieces}</td>
//                 <td>{salesDoc.price}</td>
//                 <td>{salesDoc.Name} </td>
//                 <td>{salesDoc.debt} </td>
//                 <td
//                   style={{
//                     color:
//                       salesDoc.status === "Overdue"
//                         ? "red"
//                         : salesDoc.status === "Paid"
//                         ? "green"
//                         : "black",
//                     fontWeight: "bold",
//                   }}
//                 >
//                   {salesDoc.status}
//                 </td>

//                 {isAdmin && (
//                   <td>
//                     <Button
//                       variant="danger"
//                       onClick={() => handleShowDelete(salesDoc.id)}
//                     >
//                       Delete
//                     </Button>
//                     <Modal
//                       show={showDeleteModal}
//                       onHide={handleCloseDelete}
//                       backdrop="static"
//                       keyboard={false}
//                     >
//                       <Modal.Header closeButton>
//                         <Modal.Title>Delete</Modal.Title>
//                       </Modal.Header>
//                       <Modal.Body>
//                         <p>Are you sure you want to delete this entry?</p>
//                       </Modal.Body>
//                       <Modal.Footer>
//                         <Button variant="secondary" onClick={handleCloseDelete}>
//                           Close
//                         </Button>
//                         <Button
//                           variant="danger"
//                           onClick={() => deleteEntry(itemToDelete)}
//                         >
//                           Delete
//                         </Button>
//                       </Modal.Footer>
//                     </Modal>
//                   </td>
//                 )}
//                 <td>
//                   {salesDoc.paymentReceived ? null : (
//                     <Button
//                       variant="warning"
//                       onClick={() => handlePaymentReceived(salesDoc.id)}
//                       disabled={queriedItems.includes(salesDoc.id)}
//                     >
//                       $$ Receive
//                     </Button>
//                   )}
//                   {!queriedItems.includes(salesDoc.id) && (
//                     <Button
//                       className="query"
//                       onClick={() => handleQuery(salesDoc.id)}
//                       disabled={salesDoc.paymentReceived}
//                     >
//                       Query
//                     </Button>
//                   )}

//                   {salesDoc.status === "Paid" && (
//                     <Button
//                       variant="danger"
//                       onClick={() => generatePDF(salesDoc)}
//                     >
//                       Print
//                     </Button>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </Table>
//         <div className="next-page">
//           <button className="next">
//             <FontAwesomeIcon icon={faArrowLeft} />
//           </button>
//           <p className="num active" >1</p>
//           <p className="num">2</p>
//           <p className="num">3</p>
//           <button className="next">
//             <FontAwesomeIcon icon={faArrowRight} />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Sales;

import React, { useEffect, useRef } from "react";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";
import Table from "react-bootstrap/Table";
import { Form } from "react-bootstrap";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app, db } from "../Firebase";
import { useNavigate } from "react-router-dom";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { jsPDF } from "jspdf";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";

function Sales() {
  const auth = getAuth(app);
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [isAdmin /* setIsAdmin*/] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const fetchSalesData = async () => {
          const q = query(
            collection(db, "Sales-Data"),
            where("userId", "==", currentUser.uid)
          );
          const querySnapshot = await getDocs(q);
          const fetchedSales = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setSales(fetchedSales);
          calculatePaidTotals(fetchedSales);
        };

        fetchSalesData();
      } else {
        navigate("/Signin");
      }
    });

    return () => unsub();
  }, [auth, navigate]);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      const q = query(
        collection(db, "Sales-Data"),
        where("userId", "==", user.uid)
      );
      let saleItems = [];
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((salesDoc) => {
        saleItems.push({ id: salesDoc.id, ...salesDoc.data() });
      });
      setSales(saleItems);
    };
    fetchData();
  }, [user]);

  //query sales

  const handleQuery = async (id) => {
    try {
      const saleToQuery = sales.find((sale) => sale.id === id);
      if (!saleToQuery) return;

      const queriedDocRef = doc(collection(db, "queried_sales"));
      await setDoc(queriedDocRef, {
        saleId: id,
        saleDetails: saleToQuery,
        timestamp: new Date(),
      });

      setQueriedItems((prev) => {
        const updatedQueries = [...prev, id];
        localStorage.setItem("queriedItems", JSON.stringify(updatedQueries));
        return updatedQueries;
      });
      console.log("Sale queried successfully!");
    } catch (error) {
      console.error("Error querying sale:", error);
    }
  };

  const [show, setShow] = useState(false);
  const [sales, setSales] = useState([]);
  const [selectedItem, setSelectedItem] = useState("");
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [amountDue, setAmountDue] = useState(0);
  const [totalPaidCount, setTotalPaidCount] = useState(0);
  const [totalPaidAmount, setTotalPaidAmount] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete] = useState(null);
  const [queriedItems, setQueriedItems] = useState(() => {
    const savedQueries = localStorage.getItem("queriedItems");
    return savedQueries ? JSON.parse(savedQueries) : [];
  });

  const itemRef = useRef();
  const numberOfPcsRef = useRef();
  const priceRef = useRef();
  const customerRef = useRef();
  const amountDueRef = useRef();

  const itemsPrices = {
    "Sirloin Steak": 1070,
    "Ribeye Steak": 2180,
    "Rump Steak": 1350,
    "T-Bone Steak": 1670,
    "Chuck Bone-in": 870,
    "T-Bone Steak with Accompaniments": 2170,
    "Rump Steak with Accompaniments": 1850,
    "Ribeye Steak with Accompaniments": 2680,
    "Steak with Accompaniments": 1570,
    "Chuck Bone-in with Accompaniments": 1370,
    "Choma Sausages pack": 2450,
    "Choma Sausage 2@": 350,
    "Burger Patti 1@": 220,
    "Beef Samosa": 75,
    "Omellete ": 150,
    "Omellete, Tea/ Coffee": 400,
    "Tea/ Coffee": 250,
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleCloseDelete = () => setShowDeleteModal(false);
  const handleShowDelete = () => setShowDeleteModal(true);

  const handleItemChange = (e) => {
    const selected = e.target.value;
    setSelectedItem(selected);
    const selectedPrice = itemsPrices[selected] || 0;
    setPrice(selectedPrice);
    setAmountDue(selectedPrice * quantity);
  };

  const handleQuantityChange = (e) => {
    const qty = parseInt(e.target.value);
    setQuantity(qty);
    setAmountDue(price * qty);
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const fetchData = async () => {
          const q = query(
            collection(db, "Sales-Data"),
            where("userId", "==", user.uid)
          );
          let saleItems = [];
          const querySnapshot = await getDocs(q);

          querySnapshot.forEach(async (salesDoc) => {
            const data = { id: salesDoc.id, ...salesDoc.data() };
            saleItems.push(data);
          });
          setSales(saleItems);
          calculatePaidTotals(saleItems);
        };
        fetchData();
      }
    });
  }, [auth]);

  const calculatePaidTotals = (salesData) => {
    const paidSales = salesData.filter((sale) => sale.status === "Paid");
    const count = paidSales.length;
    const totalAmount = paidSales.reduce((acc, sale) => acc + sale.debt, 0);
    setTotalPaidCount(count);
    setTotalPaidAmount(totalAmount);
  };

  async function handleSale(selectedItems, portionsSold) {
    const salesDate = new Date().toLocaleString();
    try {
      const inventorySnapshot = await getDocs(
        collection(db, "store-Inventory")
      );
      let matchedItems = [];
      inventorySnapshot.forEach((doc) => {
        const inventoryItem = doc.data();
        const inventoryProductName = inventoryItem.Product.toLowerCase();
        const isMatch = selectedItems.some((selected) => {
          const selectedItemName = selected.toLowerCase();
          const selectedWords = selectedItemName.split(" ");
          return (
            inventoryProductName.includes(selectedItemName) ||
            inventoryProductName.includes(
              selectedWords.slice(0, 1).join(" ")
            ) ||
            (selectedWords.length > 1 &&
              inventoryProductName.includes(
                selectedWords.slice(0, 2).join(" ")
              ))
          );
        });
        if (isMatch) {
          matchedItems.push({ id: doc.id, ...inventoryItem });
        }
      });

      if (matchedItems.length >= 1) {
        for (const item of matchedItems) {
          if (item.Portion >= portionsSold) {
            const newPortionCount = item.Portion - portionsSold;
            const docRef = doc(db, "store-Inventory", item.id);
            await updateDoc(docRef, {
              Portion: newPortionCount,
            });
            await sendNotification(item.Product, salesDate);
          } else {
            alert(`Not enough portions for ${item.Product}`);
          }
        }
      }
    } catch (error) {
      console.error("Error selling items:", error.message);
    }
  }

  async function sendNotification(itemName, salesDate) {
    const notificationData = {
      title: "Item Sold",
      item: itemName,
      date: salesDate,
    };

    const notificationDoc = doc(collection(db, "inventory-notifications"));
    await setDoc(notificationDoc, notificationData);
  }

  const upload = () => {
    const selectedItem = itemRef.current.value;
    const pieces = numberOfPcsRef.current.value;
    const price = priceRef.current.value;
    const customersName = customerRef.current.value;
    const amountDue = pieces * price;
    const date = new Date();

    onAuthStateChanged(auth, (user) => {
      if (user) {
        const userId = user.uid;
        const newSales = doc(collection(db, "Sales-Data"));
        const saleData = {
          userId: userId,
          item: selectedItem,
          pieces: quantity,
          price: price,
          Name: customersName,
          debt: amountDue,
          date: date.toISOString(),
          status: "Open",
        };

        setDoc(newSales, saleData, { merge: true })
          .then(() => {
            setSales((prevSales) => [
              ...prevSales,
              { id: newSales.id, ...saleData },
            ]);
            handleClose();
            handleSale([selectedItem], pieces);
          })
          .catch((error) => console.log(error.message));
      }
    });
  };

  useEffect(() => {
    const checkForOverdueSales = async () => {
      const currentTime = new Date();

      const updatedSales = await Promise.all(
        sales.map(async (sale) => {
          if (
            sale.status === "Open" &&
            currentTime - new Date(sale.date) > 1 * 60 * 1000 // 1 minute
          ) {
            const updatedSale = { ...sale, status: "Overdue" };
            await updateDoc(doc(db, "Sales-Data", sale.id), {
              status: "Overdue",
            });
            return updatedSale;
          }
          return sale;
        })
      );

      setSales(updatedSales);
    };

    const intervalId = setInterval(checkForOverdueSales, 1 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, [sales]);

  const handlePaymentReceived = async (id) => {
    const saleToUpdate = sales.find((sale) => sale.id === id);

    if (saleToUpdate) {
      const updatedSale = {
        ...saleToUpdate,
        status: "Paid",
        paymentReceived: true,
      };

      await setDoc(doc(db, "Sales-Data", id), updatedSale, { merge: true });

      setSales((prevSales) =>
        prevSales.map((sale) => (sale.id === id ? updatedSale : sale))
      );

      setTimeout(() => {
        generatePDF(updatedSale);
      }, 1 * 60 * 1000);
    }
  };

  const deleteEntry = async (id) => {
    try {
      await deleteDoc(doc(db, "Sales-Data", id));
      setSales((prevSales) => prevSales.filter((sale) => sale.id !== id));
      handleCloseDelete();
    } catch (error) {
      console.error("Error deleting document:", error.message);
    }
  };

  const generatePDF = (saleData) => {
    if (!saleData) return;

    const doc = new jsPDF();
    doc.text(`Item Sold: ${saleData.item || "Unknown Item"}`, 10, 10);
    doc.text(`Customer Name: ${saleData.Name || "Unknown Customer"}`, 10, 20);
    doc.text(`Amount Due: ${saleData.debt || 0}`, 10, 30);
    doc.text(`Status: ${saleData.status || "Unknown"}`, 10, 40);

    if (saleData.status === "Paid") {
      doc.text("PAID", 50, 50);
    }

    doc.save(`Sale_${saleData.id}.pdf`);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 9;

  const totalPages = Math.ceil(sales.length / rowsPerPage);
  const paginatedSales = sales.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="sales">
      <Sidebar />
      <div className="content">
        <Navbar />
        <div className="pay-page">
          <div className="paid">
            <p>
              <span className="painNumber">{totalPaidCount}</span>Paid
            </p>
            <p>
              Total Sales Ksh
              <span className="paidTotal"> {totalPaidAmount}</span>
            </p>
          </div>
        </div>
        <Button variant="primary" className="mb" onClick={handleShow}>
          Purchase
        </Button>

        <Modal
          show={show}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>New Sale</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="wrap">
              <label htmlFor="">Item Sold</label>
              <Form.Select
                value={selectedItem}
                className="select"
                onChange={handleItemChange}
                ref={itemRef}
              >
                <option disabled value="">
                  Select an item
                </option>
                {Object.keys(itemsPrices).map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </Form.Select>
              <label htmlFor="">Number of pieces sold</label>
              <input
                type="number"
                value={quantity}
                onChange={handleQuantityChange}
                ref={numberOfPcsRef}
                name=""
                id="numberOfPcs"
                placeholder="2 pcs"
              />
              <label htmlFor="Price">Price</label>
              <input
                type="number"
                ref={priceRef}
                value={price}
                name=""
                id="Price"
                placeholder="Price Per Piece"
              />
              <label htmlFor="Customers Name">Customers Name</label>
              <input
                type="text"
                ref={customerRef}
                name=""
                id="customersName"
                placeholder="John Jones"
              />
              <label htmlFor="amountDue">Amount Due</label>
              <input
                disabled
                value={amountDue}
                type="number"
                ref={amountDueRef}
                name=""
                id="amountDue"
                placeholder="ksh 0.00"
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={upload}>
              Sell
            </Button>
          </Modal.Footer>
        </Modal>
        <Table striped bordered hover className="meza">
          <thead>
            <tr>
              <th>#</th>
              <th>Date</th>
              <th>Item Sold</th>
              <th>No. of Pcs</th>
              <th>Price/Piece</th>
              <th>Customer's Name'</th>
              <th>Amount Due</th>
              <th>Status</th>
              {isAdmin && <th>Edit Data</th>} {/*if user is admin */}
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {sales
              .slice(
                (currentPage - 1) * rowsPerPage, // Replacing itemsPerPage with rowsPerPage
                currentPage * rowsPerPage
              )
              .map((salesDoc, index) => (
                <tr
                  key={salesDoc.id}
                  className={
                    queriedItems.includes(salesDoc.id)
                      ? "row-queried"
                      : "row-default"
                  }
                  style={{
                    backgroundColor: queriedItems.includes(salesDoc.id)
                      ? "grey"
                      : "white",
                    color: queriedItems.includes(salesDoc.id)
                      ? "lightgrey"
                      : "black",
                  }}
                >
                  <td>{(currentPage - 1) * rowsPerPage + index + 1}</td>{" "}
                  {/* Updated here */}
                  <td>{new Date(salesDoc.date).toLocaleDateString("en-GB")}</td>
                  <td>{salesDoc.item}</td>
                  <td>{salesDoc.pieces}</td>
                  <td>{salesDoc.price}</td>
                  <td>{salesDoc.Name} </td>
                  <td>{salesDoc.debt} </td>
                  <td
                    style={{
                      color:
                        salesDoc.status === "Overdue"
                          ? "red"
                          : salesDoc.status === "Paid"
                          ? "green"
                          : "black",
                      fontWeight: "bold",
                    }}
                  >
                    {salesDoc.status}
                  </td>
                  {isAdmin && (
                    <td>
                      <Button
                        variant="danger"
                        onClick={() => handleShowDelete(salesDoc.id)}
                      >
                        Delete
                      </Button>
                      <Modal
                        show={showDeleteModal}
                        onHide={handleCloseDelete}
                        backdrop="static"
                        keyboard={false}
                      >
                        <Modal.Header closeButton>
                          <Modal.Title>Delete</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <p>Are you sure you want to delete this entry?</p>
                        </Modal.Body>
                        <Modal.Footer>
                          <Button
                            variant="secondary"
                            onClick={handleCloseDelete}
                          >
                            Close
                          </Button>
                          <Button
                            variant="danger"
                            onClick={() => deleteEntry(itemToDelete)}
                          >
                            Delete
                          </Button>
                        </Modal.Footer>
                      </Modal>
                    </td>
                  )}
                  <td>
                    <Button
                      variant="info"
                      onClick={() => handleQuery(salesDoc.id)}
                    >
                      Query
                    </Button>
                    <Button
                      variant="success"
                      onClick={() => generatePDF(salesDoc)}
                    >
                      Print
                    </Button>
                    {salesDoc.paymentReceived ? null : (
                      <Button
                        variant="warning"
                        onClick={() => handlePaymentReceived(salesDoc.id)}
                      >
                        Mark as Paid
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
        {totalPages > 1 && (
          <div className="pagination">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            >
              <FontAwesomeIcon icon={faArrowLeft} />
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                className={`page-btn ${
                  currentPage === index + 1 ? "active" : ""
                }`}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}
            <button
              disabled={currentPage === totalPages}
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
            >
              <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Sales;
