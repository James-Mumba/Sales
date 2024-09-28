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
  where,
} from "firebase/firestore";

function Sales() {
  const auth = getAuth(app);
  const navigate = useNavigate();

  onAuthStateChanged(auth, (user) => {
    if (!user) {
      navigate("/Signin");
    }
  });

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  //fetching Data from firestore
  const [sales, setSales] = useState([]);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const userId = user.uid;

        const fetchData = async () => {
          const q = query(
            collection(db, "Sales-Data"),
            where("userId", "==", userId)
          );
          let saleItems = [];
          const querySnapshot = await getDocs(q);

          querySnapshot.forEach((salesDoc) => {
            saleItems.push({
              id: salesDoc.id,
              ...salesDoc.data(),
            });
            setSales([...saleItems]);
          });
        };
        fetchData();
      }
    });
  }, []);

  //sending data to firestore
  const itemRef = useRef();
  const numberOfPcsRef = useRef();
  const priceRef = useRef();
  const customerRef = useRef();
  const amountDueRef = useRef();

  function upload() {
    const Item = itemRef.current.value;
    const pieces = numberOfPcsRef.current.value;
    const price = priceRef.current.value;
    const customersName = customerRef.current.value;
    const amountDue = pieces * price;

    onAuthStateChanged(auth, (user) => {
      if (user) {
        const userId = user.uid;
        console.log(userId);

        const newSales = doc(collection(db, "Sales-Data"));

        setDoc(newSales, {
          userId: userId,
          item: Item,
          pieces: pieces,
          price: price,
          Name: customersName,
          debt: amountDue,
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

  //delete data on firestore
  const deleteEntry = async (id) => {
    try {
      const docid = id;

      await deleteDoc(doc(db, "Sales-Data", docid));
      window.location.reload();
    } catch (error) {
      const errorMessage = error.message;
      console.log(errorMessage);
    }
  };

  const [show1, setShowDel] = useState(false);

  const handleCloseDelete = () => setShowDel(false);
  const handleShowDelete = () => setShowDel(true);

  return (
    <div className="sales">
      <Sidebar />
      <div className="content">
        <Navbar />
        <div className="pay-page">
          <div className="overdued">
            <p>
              <span>2</span> Overdue Payments
            </p>
            <p>
              Amount Ksh <span>450</span>
            </p>
          </div>
          <div className="unpaid">
            <p>
              <span>14 </span>Open Invoices
            </p>
            <p>
              Amount Ksh<span> 2,893</span>
            </p>
          </div>
          <div className="paid">
            <p>
              <span>12 </span>Paid
            </p>
            <p>
              Available Bal. Ksh<span> 1,234</span>
            </p>
          </div>
        </div>
        <Button variant="primary" className="mb--" onClick={handleShow}>
          Record
        </Button>

        <Modal
          show={show}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>Modal title</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="wrap">
              <label htmlFor="">Item Sold</label>
              <input
                type="text"
                name=""
                ref={itemRef}
                id="itemSold"
                placeholder="Gold FH Sausages"
              />
              <label htmlFor="">Number of pieces sold</label>
              <input
                type="number"
                ref={numberOfPcsRef}
                name=""
                id="numberOfPcs"
                placeholder="2 pcs"
              />
              <label htmlFor="Price">Price</label>
              <input
                type="number"
                ref={priceRef}
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
                type="number"
                ref={amountDueRef}
                name=""
                id="amountDue"
                placeholder="ksh 0.00"
              />
              <Form.Select size="sm" className="long">
                <option disabled>select status</option>
                <option>Open</option>
              </Form.Select>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={upload}>
              Buy
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
              <th>Edit Data</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((salesDoc) => (
              <tr key={salesDoc.id}>
                <td>1</td>
                <td>23/09/2024</td>
                <td>{salesDoc.item}</td>
                <td>{salesDoc.pieces}</td>
                <td>{salesDoc.price}</td>
                <td>{salesDoc.Name} </td>
                <td>{salesDoc.debt} </td>
                <td>Open</td>
                <td>
                  <Button variant="primary" onClick={handleShowDelete}>
                    Delete Entry
                  </Button>
                  <Modal
                    show={show1}
                    onHide={handleCloseDelete}
                    backdrop="static"
                    keyboard={false}
                  >
                    <Modal.Header closeButton>
                      <Modal.Title>Modal title</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <p>Deleting Entry</p>
                      <p> Are yo sure?</p>
                    </Modal.Body>
                    <Modal.Footer>
                      <Button variant="secondary" onClick={handleCloseDelete}>
                        Close
                      </Button>
                      <Button
                        variant="primary"
                        onClick={() => deleteEntry(salesDoc.id)}
                      >
                        Delete
                      </Button>
                    </Modal.Footer>
                  </Modal>
                </td>
                <td>
                  <Form.Select size="sm">
                    <option>Print</option>
                    <option>Payment Received</option>
                    <option>Copy to invoice</option>
                  </Form.Select>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}

export default Sales;
