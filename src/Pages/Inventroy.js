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

  const [showClearMessage, setShowClearMessage] = useState(false); // State to manage "All Clear" message

  // Authentication Check
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

  // Fetch my Inventory Data
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
      fetchInventory(userId); 
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
      fetchInventory(userId);
      setShow(false);
    }
  };

  // Notifications
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

  const clearNotifications = () => {
    setNotifications([]);
    setShowClearMessage(true);
  };

  const deleteNotification = async (id) => {
    await deleteDoc(doc(db, "inventory-notifications", id));
    setNotifications((prevNotifications) =>
      prevNotifications.filter((notification) => notification.id !== id)
    );
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
                <th>User</th>
                <th>Category</th>
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
                      onClick={() => handleUpdateShow(item)}
                    >
                      <FontAwesomeIcon className="pen" icon={faFilePen} />
                    </Button>
                    <Button
                      className="pen"
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

          {/* Show "All Clear" message if there are no notifications */}
          {showClearMessage ? (
            <div className="all-clear" style={{ color: "grey" }}>
              All Clear
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => deleteNotification(notification.id)}
                className="order-content"
              >
                <div className="icon">
                  <FontAwesomeIcon icon={faCartShopping} />
                </div>
                <p className="icon-name-head">
                  <strong>{notification.title}</strong>
                  <FontAwesomeIcon className="check" icon={faCircleCheck} />
                </p>
                <p className="icon-item">
                  <small>{notification.item}</small>
                </p>
                <p className="icon-date">{notification.date}</p>
              </div>
            ))
          )}
          {/* Conditionally render the Clear button if there are notifications */}
          {notifications.length > 0 && (
            <Button variant="secondary" onClick={clearNotifications}>
              Hide
            </Button>
          )}
        </div>

        {/* Modal for Adding or Updating */}
        <Modal show={show} onHide={() => setShow(false)} backdrop="static">
          <Modal.Header closeButton>
            <Modal.Title>
              {updateItem ? "Update Item" : "Add Stock"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="wrap">
              <label>Item Name</label>
              <input
                type="text"
                ref={nameItemRef}
                defaultValue={updateItem ? updateItem.Product : ""}
              />
              <label>User</label>
              <input
                type="text"
                ref={companyRef}
                defaultValue={updateItem ? updateItem.Supplier : ""}
              />
              <label>Group/ Type</label>
              <input
                type="text"
                ref={groupRef}
                placeholder="Snack..."
                defaultValue={updateItem ? updateItem.Group : ""}
              />
              <label>Quantity in Kgs</label>
              <input
                type="text"
                ref={quantityRef}
                defaultValue={updateItem ? updateItem.Weight : ""}
              />
              <label>No. of Portion</label>
              <input
                type="text"
                ref={portionRef}
                defaultValue={updateItem ? updateItem.Portion : ""}
              />
            </div>
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
