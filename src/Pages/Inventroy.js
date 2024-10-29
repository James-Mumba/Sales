// import React, { useEffect, useRef, useState } from "react";
// import Sidebar from "../Components/Sidebar";
// import Navbar from "../Components/Navbar";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faCartShopping,
//   faCircleCheck,
//   faFilePen,
//   faPlus,
//   faPrint,
//   faTrashCan,
// } from "@fortawesome/free-solid-svg-icons";
// import { getAuth, onAuthStateChanged } from "firebase/auth";
// import { app, db } from "../Firebase";
// import { useNavigate } from "react-router-dom";
// import Modal from "react-bootstrap/Modal";
// import Button from "react-bootstrap/Button";
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

// function Inventroy() {
//   const auth = getAuth(app);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       if (!user) {
//         navigate("/Signin");
//       }
//     });

//     // Cleanup the subscription on unmount
//     return () => unsubscribe();
//   }, [auth, navigate]);

//   const [show, setShow] = useState(false);

//   const handleClose = () => setShow(false);
//   const handleShow = () => setShow(true);
//   const [storage, setStorage] = useState([]);

//   //fetch
//   useEffect(() => {
//     onAuthStateChanged(auth, (user) => {
//       if (user) {
//         const userId = user.uid;

//         const fetchData = async () => {
//           const q = query(
//             collection(db, "store-Inventory"),
//             where("userId", "==", userId)
//           );
//           let storedItems = [];
//           const querySnapshot = await getDocs(q);

//           querySnapshot.forEach((storeageDoc) => {
//             storedItems.push({
//               id: storeageDoc.id,
//               ...storeageDoc.data(),
//             });
//             setStorage([...storedItems]);
//           });
//         };
//         fetchData();
//       }
//     });
//   }, [auth]);

//   //send to firestore
//   const nameItemRef = useRef();
//   const companyRef = useRef();
//   const groupRef = useRef();
//   const quantityRef = useRef();
//   const portionRef = useRef();

//   function store() {
//     const product = nameItemRef.current.value;
//     const supplier = companyRef.current.value;
//     const itemGroup = groupRef.current.value;
//     const quantity = quantityRef.current.value;
//     const portion = portionRef.current.value;

//     onAuthStateChanged(auth, (user) => {
//       if (user) {
//         const userId = user.uid;

//         const dataInventory = doc(collection(db, "store-Inventory"));

//         setDoc(dataInventory, {
//           userId: userId,
//           Product: product,
//           Supplier: supplier,
//           Group: itemGroup,
//           Weight: quantity,
//           Portion: portion,
//         })
//           .then(() => {
//             window.location.reload();
//           })
//           .catch((error) => {
//             const errorMessage = error.message;
//             console.log(errorMessage);
//           });
//       }
//     });
//   }

//   //fetch user
//   const [user, setUser] = useState([]);

//   useEffect(() => {
//     onAuthStateChanged(auth, (user) => {
//       if (user) {
//         const userId = user.uid;
//         console.log(userId);
//         const fetchData = async () => {
//           const q = query(
//             collection(db, "clients-Data"),
//             where("userId", "==", userId)
//           );
//           let clientsNames = [];
//           const querySnapshot = await getDocs(q);

//           querySnapshot.forEach((clientsDoc) => {
//             clientsNames.push({
//               id: clientsDoc.id,
//               ...clientsDoc.data(),
//             });
//           });
//           setUser(clientsNames); // Update after loop
//         };
//         fetchData();
//       }
//     });
//   }, [auth]);

//   const generateUniqueCode = () => {
//     return Math.random().toString(36).substr(2, 5).toUpperCase();
//   };

//   //Delete

//   const deleteData = async (id) => {
//     try {
//       const docid = id;

//       await deleteDoc(doc(db, "store-Inventory", docid));
//       window.location.reload();
//     } catch (error) {
//       const errorMessage = error.message;
//       console.log(errorMessage);
//     }
//   };

//   //Update

//   const [change, setUpdateChange] = useState(false);

//   const handleUpdateClose = () => setUpdateChange(false);
//   const handleUpdateShow = () => setUpdateChange(true);

//   const changeInventory = async (id, newData) => {
//     try {
//       const docid = id;
//       const docRef = doc(db, "store-Inventory", docid);

//       await updateDoc(docRef, newData);
//       window.location.reload();
//     } catch (error) {
//       const errorMessage = error.message;
//       console.log(errorMessage);
//     }
//     handleUpdateShow();

//     window.changeInventory = function () {
//       const quantity = quantityRef.current.value;
//       const portion = portionRef.current.value;

//       const changeInventory = doc(db, "store-Inventory", id);
//       updateDoc(changeInventory, {
//         Weight: quantity,
//         Portion: portion,
//       })
//         .then(() => {
//           window.location.reload();
//         })
//         .catch((error) => {
//           const errorMessage = error.message;
//           console.log(errorMessage);
//         });
//     };
//   };

//   //end of Update

//   function InventoryNotifications() {
//     const [notifications, setNotifications] = useState([]);

//     // Fetch notifications from Firestore
//     useEffect(() => {
//       const fetchNotifications = async () => {
//         const notificationQuery = await getDocs(
//           collection(db, "inventory-notifications")
//         );
//         const notificationList = [];

//         notificationQuery.forEach((doc) => {
//           notificationList.push({
//             id: doc.id,
//             ...doc.data(),
//           });
//         });
//         setNotifications(notificationList);
//       };

//       fetchNotifications();
//     }, []);

//     return (
//       <div className="inventory">
//         <Sidebar />
//         <div className="content">
//           <Navbar />
//           <div className="title">
//             <div className="small-top">
//               <h4>Inventory</h4>
//               <Button onClick={handleShow} className="sendReport">
//                 <FontAwesomeIcon className="log1" icon={faPlus} />
//               </Button>

//               <Modal
//                 show={show}
//                 onHide={handleClose}
//                 backdrop="static"
//                 keyboard={false}
//               >
//                 <Modal.Header closeButton>
//                   <Modal.Title>Add Stock</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body className="mbody">
//                   <label htmlFor="Item Name">Item Name</label>
//                   <input
//                     type="text"
//                     name=""
//                     id=""
//                     ref={nameItemRef}
//                     placeholder="Chuck Bone-in"
//                   />
//                   <label htmlFor="Suppliers">Company Name</label>
//                   <input
//                     type="text"
//                     name=""
//                     id=""
//                     ref={companyRef}
//                     placeholder="Ongole Beef LTD"
//                   />
//                   <label htmlFor="Item Name">Item Group</label>
//                   <input
//                     type="text"
//                     name=""
//                     id=""
//                     ref={groupRef}
//                     placeholder="Beef"
//                   />
//                   <label htmlFor="Item Quantity">Quantity</label>
//                   <input
//                     type="text"
//                     name=""
//                     id=""
//                     ref={quantityRef}
//                     placeholder="1 kg"
//                   />
//                   <label htmlFor="Portion">Portion</label>
//                   <input
//                     type="text"
//                     name=""
//                     id=""
//                     ref={portionRef}
//                     placeholder="2 ptns"
//                   />
//                 </Modal.Body>
//                 <Modal.Footer>
//                   <Button variant="secondary" onClick={handleClose}>
//                     Close
//                   </Button>
//                   <Button variant="primary" onClick={store}>
//                     Add
//                   </Button>
//                 </Modal.Footer>
//               </Modal>
//               <button className="print">
//                 <FontAwesomeIcon className="log" icon={faPrint} />
//               </button>
//             </div>
//           </div>

//           <Modal
//             show={change}
//             onHide={handleClose}
//             backdrop="static"
//             keyboard={false}
//             animation={true}
//           >
//             <Modal.Header closeButton>
//               <Modal.Title>Update</Modal.Title>
//             </Modal.Header>
//             <Modal.Body>
//               <label htmlFor="Item Quantity">Quantity</label>
//               <input
//                 type="text"
//                 name=""
//                 id=""
//                 ref={quantityRef}
//                 placeholder="1 kg"
//               />
//               <label htmlFor="Portion">Portion</label>
//               <input
//                 type="text"
//                 name=""
//                 id=""
//                 ref={portionRef}
//                 placeholder="2 ptns"
//               />
//             </Modal.Body>
//             <Modal.Footer>
//               <Button variant="secondary" onClick={handleUpdateClose}>
//                 Close
//               </Button>
//               <Button variant="primary" onClick={window.changeInventory}>
//                 Update
//               </Button>
//             </Modal.Footer>
//           </Modal>
//           <table className="table">
//             <thead>
//               <tr>
//                 <th className="grey">Item Code</th>
//                 <th className="grey">Item Name</th>
//                 <th className="grey">Ordered From</th>
//                 <th className="grey">Item Group</th>
//                 <th className="grey">Quantity</th>
//                 <th className="grey">Portions</th>
//                 <th className="grey">Purchased By</th>
//                 <th className="grey">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {storage.map((storeageDoc) => (
//                 <tr key={storeageDoc.id}>
//                   <td className="light">{generateUniqueCode()}</td>
//                   <td className="light">{storeageDoc.Product}</td>
//                   <td className="light">{storeageDoc.Supplier}</td>
//                   <td className="light">{storeageDoc.Group}</td>
//                   <td className="light">{storeageDoc.Weight}</td>
//                   <td className="light">{storeageDoc.Portion}</td>
//                   <td className="light">
//                     {" "}
//                     {user.length > 0 ? user[0].user : "No user found"}
//                   </td>
//                   <td className="light">
//                     <Button
//                       variant="warning"
//                       onClick={() => changeInventory(storeageDoc.id)}
//                     >
//                       <FontAwesomeIcon className="btns blue" icon={faFilePen} />
//                     </Button>

//                     <button
//                       className="delete"
//                       onClick={() => deleteData(storeageDoc.id)}
//                     >
//                       <FontAwesomeIcon className="btns red" icon={faTrashCan} />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//           <div className="requested">
//             <div className="order-title">
//               <h4>Order History</h4>
//             </div>
//             <hr />
//             <div className="order-content">
//               <div className="icon">
//                 <FontAwesomeIcon icon={faCartShopping} />
//               </div>
//               {notifications.map((notification) => (
//                 <div key={notification.id} className="icon-name">
//                   <p className="icon-name-head">
//                     <strong>{notification.title}</strong>
//                     <FontAwesomeIcon className="check" icon={faCircleCheck} />
//                   </p>
//                   <p className="icon-item">
//                     <small>{notification.item}</small>
//                   </p>
//                   <p className="icon-date">{notification.date}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }
// }

// export default Inventroy;

import React, { useEffect, useRef, useState } from "react";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  faCircleCheck,
  faFilePen,
  faPlus,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app, db } from "../Firebase";
import { useNavigate } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
  addDoc,
} from "firebase/firestore";

function Inventory() {
  const auth = getAuth(app);
  const navigate = useNavigate();
  const [storage, setStorage] = useState([]);
  const [userId, setUserId] = useState(null);
  const [show, setShow] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const nameItemRef = useRef();
  const companyRef = useRef();
  const groupRef = useRef();
  const quantityRef = useRef();
  const portionRef = useRef();

  // Centralized Authentication Check
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/Signin");
      } else {
        setUserId(user.uid);
        fetchInventory(user.uid);
      }
    });
    return () => unsubscribe();
  }, [auth, navigate]);

  // Fetch Inventory Data
  const fetchInventory = async (userId) => {
    const q = query(
      collection(db, "store-Inventory"),
      where("userId", "==", userId)
    );
    const querySnapshot = await getDocs(q);
    const storedItems = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setStorage(storedItems);
  };

  // Store new Inventory item
  const store = async () => {
    if (userId) {
      const newInventoryData = {
        userId: userId,
        Product: nameItemRef.current.value,
        Supplier: companyRef.current.value,
        Group: groupRef.current.value,
        Weight: quantityRef.current.value,
        Portion: portionRef.current.value,
      };

      await addDoc(collection(db, "store-Inventory"), newInventoryData);
      fetchInventory(userId); // Re-fetch after adding new item
      setShow(false);
    }
  };

  // Delete Inventory Item
  const deleteData = async (id) => {
    await deleteDoc(doc(db, "store-Inventory", id));
    setStorage(storage.filter((item) => item.id !== id)); // Update UI without reloading
  };

  // Handle Update Modal (State for Editing)
  const [updateItem, setUpdateItem] = useState(null);

  const handleUpdateShow = (item) => {
    setUpdateItem(item);
    setShow(true);
  };

  const updateInventory = async () => {
    if (updateItem) {
      const updatedData = {
        Weight: quantityRef.current.value,
        Portion: portionRef.current.value,
      };

      await updateDoc(doc(db, "store-Inventory", updateItem.id), updatedData);
      fetchInventory(userId); // Refresh inventory after update
      setShow(false);
    }
  };

  // Fetch Notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      const notificationSnapshot = await getDocs(
        collection(db, "inventory-notifications")
      );
      const notificationsList = notificationSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNotifications(notificationsList);
    };

    fetchNotifications();
  }, []);

  // Add Notification
  const addNotification = async (itemSold) => {
    const newNotification = {
      title: "Item Sold",
      item: itemSold.Product,
      date: new Date().toLocaleString(),
    };

    await addDoc(collection(db, "inventory-notifications"), newNotification);
    setNotifications((prev) => [...prev, newNotification]); // Update state without re-fetching
  };

  return (
    <div className="inventory">
      <Sidebar />
      <div className="content">
        <Navbar />

        {/* Inventory List */}
        <div className="inventory-list">
          <h4>Inventory</h4>
          <Button onClick={() => setShow(true)} className="add-item-btn">
            <FontAwesomeIcon icon={faPlus} /> Add Stock
          </Button>

          <table className="table table-striped">
            <thead>
              <tr>
                <th>#</th>
                <th>Product</th>
                <th>Supplier</th>
                <th>Group</th>
                <th>Weight</th>
                <th>Portion</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {storage.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>{item.Product}</td>
                  <td>{item.Supplier}</td>
                  <td>{item.Group}</td>
                  <td>{item.Weight}</td>
                  <td>{item.Portion}</td>
                  <td>
                    <Button
                      variant="warning"
                      onClick={() => handleUpdateShow(item)}
                    >
                      <FontAwesomeIcon icon={faFilePen} />
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => deleteData(item.id)}
                    >
                      <FontAwesomeIcon icon={faTrashCan} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Notifications */}
        {/* Notifications */}
        <div className="requested">
          <div className="order-title">
            <h4>Order History</h4>
          </div>
          <hr />
          <div className="order-content">
            <div className="icon">
              <FontAwesomeIcon icon={faCartShopping} />
            </div>
            {notifications.map((notification) => (
              <div  key={notification.id} >
                <p className="icon-name-head">
                  <strong>{notification.title}</strong>
                  <FontAwesomeIcon className="check" icon={faCircleCheck} />
                </p>
                <p className="icon-item">
                  <small>{notification.item}</small>
                </p>
                <p className="icon-date">{notification.date}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Modal for Adding or Updating */}
        <Modal show={show} onHide={() => setShow(false)} backdrop="static">
          <Modal.Header closeButton>
            <Modal.Title>
              {updateItem ? "Update Item" : "Add Stock"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <label>Item Name</label>
            <input
              type="text"
              ref={nameItemRef}
              defaultValue={updateItem ? updateItem.Product : ""}
            />

            <label>Supplier</label>
            <input
              type="text"
              ref={companyRef}
              defaultValue={updateItem ? updateItem.Supplier : ""}
            />

            <label>Group</label>
            <input
              type="text"
              ref={groupRef}
              defaultValue={updateItem ? updateItem.Group : ""}
            />

            <label>Quantity</label>
            <input
              type="text"
              ref={quantityRef}
              defaultValue={updateItem ? updateItem.Weight : ""}
            />

            <label>Portion</label>
            <input
              type="text"
              ref={portionRef}
              defaultValue={updateItem ? updateItem.Portion : ""}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShow(false)}>
              Close
            </Button>
            <Button
              variant="primary"
              onClick={updateItem ? updateInventory : store}
            >
              {updateItem ? "Update" : "Add"}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}

export default Inventory;
