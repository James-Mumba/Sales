import React, { useEffect, useRef, useState } from "react";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  faCircleCheck,
  faFilePen,
  faPlus,
  faPrint,
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
  where,
} from "firebase/firestore";

function Inventroy() {
  const auth = getAuth(app);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/Signin");
      }
    });

    // Cleanup the subscription on unmount
    return () => unsubscribe();
  }, [auth, navigate]);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [storage, setStorage] = useState([]);

  //fetch
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const userId = user.uid;

        const fetchData = async () => {
          const q = query(
            collection(db, "store-Inventory"),
            where("userId", "==", userId)
          );
          let storedItems = [];
          const querySnapshot = await getDocs(q);

          querySnapshot.forEach((storeageDoc) => {
            storedItems.push({
              id: storeageDoc.id,
              ...storeageDoc.data(),
            });
            setStorage([...storedItems]);
          });
        };
        fetchData();
      }
    });
  }, [auth]);

  //send to firestore
  const nameItemRef = useRef();
  const companyRef = useRef();
  const groupRef = useRef();
  const quantityRef = useRef();
  const portionRef = useRef();

  function store() {
    const product = nameItemRef.current.value;
    const supplier = companyRef.current.value;
    const itemGroup = groupRef.current.value;
    const quantity = quantityRef.current.value;
    const portion = portionRef.current.value;

    onAuthStateChanged(auth, (user) => {
      if (user) {
        const userId = user.uid;

        const dataInventory = doc(collection(db, "store-Inventory"));

        setDoc(dataInventory, {
          userId: userId,
          Product: product,
          Supplier: supplier,
          Group: itemGroup,
          Weight: quantity,
          Portion: portion,
        })
          .then(() => {
            window.location.reload();
          })
          .catch((error) => {
            const errorMessage = error.message;
            console.log(errorMessage);
          });
      }
    });
  }

  //fetch user
  const [user, setUser] = useState([]);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const userId = user.uid;
        console.log(userId);
        const fetchData = async () => {
          const q = query(
            collection(db, "clients-Data")
            // where("userId", "==", userId)
          );
          let clientsNames = [];
          const querySnapshot = await getDocs(q);

          querySnapshot.forEach((clientsDoc) => {
            clientsNames.push({
              id: clientsDoc.id,
              ...clientsDoc.data(),
            });
          });
          setUser(clientsNames); // Update after loop
        };
        fetchData();
      }
    });
  }, [auth]);

  const generateUniqueCode = () => {
    return Math.random().toString(36).substr(2, 5).toUpperCase();
  };

  //Delete

  const deleteData = async (id) => {
    try {
      const docid = id;

      await deleteDoc(doc(db, "store-Inventory", docid));
      window.location.reload();
    } catch (error) {
      const errorMessage = error.message;
      console.log(errorMessage);
    }
  };

  return (
    <div className="inventory">
      <Sidebar />
      <div className="content">
        <Navbar />
        <div className="title">
          <div className="small-top">
            <h4>Inventory</h4>
            <Button onClick={handleShow} className="sendReport">
              <FontAwesomeIcon className="log1" icon={faPlus} />
            </Button>

            <Modal
              show={show}
              onHide={handleClose}
              backdrop="static"
              keyboard={false}
            >
              <Modal.Header closeButton>
                <Modal.Title>Add Stock</Modal.Title>
              </Modal.Header>
              <Modal.Body className="mbody">
                <label htmlFor="Item Name">Item Name</label>
                <input
                  type="text"
                  name=""
                  id=""
                  ref={nameItemRef}
                  placeholder="Chuck Bone-in"
                />
                <label htmlFor="Suppliers">Company Name</label>
                <input
                  type="text"
                  name=""
                  id=""
                  ref={companyRef}
                  placeholder="Ongole Beef LTD"
                />
                <label htmlFor="Item Name">Item Group</label>
                <input
                  type="text"
                  name=""
                  id=""
                  ref={groupRef}
                  placeholder="Beef"
                />
                <label htmlFor="Item Quantity">Quantity</label>
                <input
                  type="text"
                  name=""
                  id=""
                  ref={quantityRef}
                  placeholder="1 kg"
                />
                <label htmlFor="Portion">Portion</label>
                <input
                  type="text"
                  name=""
                  id=""
                  ref={portionRef}
                  placeholder="2 ptns"
                />
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Close
                </Button>
                <Button variant="primary" onClick={store}>
                  Add
                </Button>
              </Modal.Footer>
            </Modal>
            <button className="print">
              <FontAwesomeIcon className="log" icon={faPrint} />
            </button>
          </div>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th className="grey">Item Code</th>
              <th className="grey">Item Name</th>
              <th className="grey">Ordered From</th>
              <th className="grey">Item Group</th>
              <th className="grey">Quantity</th>
              <th className="grey">Portions</th>
              <th className="grey">Purchased By</th>
              <th className="grey">Actions</th>
            </tr>
          </thead>
          <tbody>
            {storage.map((storeageDoc) => (
              <tr key={storeageDoc.id}>
                <td className="light">{generateUniqueCode()}</td>
                <td className="light">{storeageDoc.Product}</td>
                <td className="light">{storeageDoc.Supplier}</td>
                <td className="light">{storeageDoc.Group}</td>
                <td className="light">{storeageDoc.Weight}</td>
                <td className="light">{storeageDoc.Portion}</td>
                <td className="light">
                  {" "}
                  {user.length > 0 ? user[0].user : "No user found"}
                </td>
                <td className="light">
                  <button className="edit">
                    <FontAwesomeIcon className="btns blue" icon={faFilePen} />
                  </button>
                  <button
                    className="delete"
                    onClick={() => deleteData(storeageDoc.id)}
                  >
                    <FontAwesomeIcon className="btns red" icon={faTrashCan} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="requested">
          <div className="order-title">
            <h4>Order History</h4>
          </div>
          <hr />
          <div className="order-content">
            <div className="icon">
              <FontAwesomeIcon icon={faCartShopping} />
            </div>
            <div className="icon-name">
              <p className="icon-name-head">
                Order Placed
                <FontAwesomeIcon className="check" icon={faCircleCheck} />
              </p>
              <p className="icon-item">
                <small>Chuck bone-in</small>
              </p>
              <p className="icon-date">04/10/2024</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Inventroy;
