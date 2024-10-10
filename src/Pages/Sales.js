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
import { jsPDF } from "jspdf";

function Sales() {
  const auth = getAuth(app);
  const navigate = useNavigate();

  const [show, setShow] = useState(false);
  const [sales, setSales] = useState([]);
  const [selectedItem, setSelectedItem] = useState(""); // Track selected item
  const [price, setPrice] = useState(0); // Track auto-filled price
  const [quantity, setQuantity] = useState(1); // Default quantity
  const [amountDue, setAmountDue] = useState(0); // Auto-calculated amount due
  const [totalPaidCount, setTotalPaidCount] = useState(0);
  const [totalPaidAmount, setTotalPaidAmount] = useState(0);
  const [show1, setShowDel] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [unpaidSales, setUnpaidSales] = useState([]);
  const [printedSales, setPrintedSales] = useState([]);

  const itemRef = useRef();
  const numberOfPcsRef = useRef();
  const priceRef = useRef();
  const customerRef = useRef();
  const amountDueRef = useRef();

  const itemsPrices = {
    "Grilled Sirloin Steak": 1070,
    "Grilled Ribeye Steak": 2180,
    "Grilled Rump Steak": 1350,
    "Grilled T-Bone Steak": 1670,
    "Grilled Chuck Bone-in": 870,
    "Grilled T-Bone Steak with Accompaniments": 2170,
    "Grilled Rump Steak with Accompaniments": 1850,
    "Grilled Ribeye Steak with Accompaniments": 2680,
    "Sirloin Steak with Accompaniments": 1570,
    "Grilled Chuck Bone-in with Accompaniments": 1370,
    "Choma Sausages pack": 2450,
    "Choma Sausage 2@": 350,
    "Burger Patti 1@": 220,
    "Samosa 2@": 150,
    "Samosa 1@": 75,
    Omellete: 150,
    "Omellete, Tea/ Coffee": 400,
    "Tea/ Coffee": 250,
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleCloseDelete = () => setShowDel(false);
  const handleShowDelete = () => setShowDel(true);

  // Handle item selection change
  const handleItemChange = (e) => {
    const selected = e.target.value;
    setSelectedItem(selected);
    const selectedPrice = itemsPrices[selected] || 0;
    setPrice(selectedPrice);
    setAmountDue(selectedPrice * quantity);
  };

  // Calculate quantity change and recalculate amount due
  const handleQuantityChange = (e) => {
    const qty = parseInt(e.target.value);
    setQuantity(qty);
    setAmountDue(price * qty);
  };

  // Fetch sales data from Firestore
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
            const saleDate = new Date(data.date);
            const now = new Date();
            const timeDiff = now - saleDate; // Time difference in milliseconds
            const fiveMinute = 5 * 60 * 1000; // 5 minutes in milliseconds

            if (data.status === "Open" && timeDiff > fiveMinute) {
              data.status = "Overdue";
              await setDoc(
                doc(db, "Sales-Data", data.id),
                { status: "Overdue" },
                { merge: true }
              );
            }
            saleItems.push(data);
          });
          setSales(saleItems);
          calculatePaidTotals(saleItems);
        };
        fetchData();
      } else {
        navigate("/Signin");
      }
    });
  }, [auth, navigate]);

  // Calculate total paid count and amount
  const calculatePaidTotals = (salesData) => {
    const paidSales = salesData.filter((sale) => sale.status === "Paid");
    const count = paidSales.length;
    const totalAmount = paidSales.reduce((acc, sale) => acc + sale.debt, 0);
    setTotalPaidCount(count);
    setTotalPaidAmount(totalAmount);
  };

  // Function to handle uploading new sales
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
            window.location.reload();
          })
          .catch((error) => console.log(error.message));
      }
    });
  };

  // Function to handle payment received
  const handlePaymentReceived = async (id) => {
    const saleToUpdate = sales.find((sale) => sale.id === id);

    if (saleToUpdate) {
      const updatedSale = {
        ...saleToUpdate,
        status: "Paid",
        paymentReceived: true,
      };

      // Update Firestore with new status
      await setDoc(doc(db, "Sales-Data", id), updatedSale, { merge: true });

      // Update local state
      setSales((prevSales) =>
        prevSales.map((sale) => (sale.id === id ? updatedSale : sale))
      );

      // Generate PDF after 2 minutes
      setTimeout(() => {
        generatePDF(updatedSale);
      }, 2 * 60 * 1000);
    }
  };

  // Function to delete sales entry
  const deleteEntry = async (id) => {
    try {
      await deleteDoc(doc(db, "Sales-Data", id)); // Delete from Firestore
      setSales((prevSales) => prevSales.filter((sale) => sale.id !== id)); // Update local state
      console.log("Document deleted with ID:", id);
    } catch (error) {
      console.error("Error deleting document:", error.message);
    }
  };

  // Function to generate PDF for sales
  const generatePDF = (saleData) => {
    if (!saleData) {
      setPrintedSales((prev) => [...prev, saleData]);
      console.error("Sales data is missing.");
      return;
    }

    const doc = new jsPDF();
    doc.text(`Item Sold: ${saleData.item || "Unknown Item"}`, 10, 10);
    doc.text(`Customer Name: ${saleData.Name || "Unknown Customer"}`, 10, 20);
    doc.text(`Amount Due: ${saleData.debt || 0}`, 10, 30);
    doc.text(`Status: ${saleData.status || "Unknown"}`, 10, 40);

    if (saleData.status === "Paid") {
      doc.text("PAID", 50, 50); // Placeholder for the "PAID" stamp
    }

    doc.save(`Sale_${saleData.id}.pdf`);
    setUnpaidSales((prevUnpaidSales) => [...prevUnpaidSales, saleData]);
  };

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
              Available Bal. Ksh
              <span className="paidTotal">{totalPaidAmount}</span>
            </p>
          </div>
        </div>
        <Button variant="primary" className="mb" onClick={handleShow}>
          Sell
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
              <th>Edit Data</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((salesDoc, index) => (
              <tr key={salesDoc.id}>
                <td>{index + 1}</td>
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
                        ? "lightgreen"
                        : "black",
                    fontWeight: salesDoc.status === "Open" ? "bold" : "normal",
                  }}
                >
                  {salesDoc.status}
                </td>
                <td>
                  <Button
                    variant="primary"
                    onClick={() => {
                      setItemToDelete(salesDoc.id); // Store the ID of the item to be deleted
                      handleShowDelete();
                    }}
                  >
                    Delete
                  </Button>
                  <Modal
                    show={show1}
                    onHide={handleCloseDelete}
                    backdrop="static"
                    keyboard={false}
                  >
                    <Modal.Header closeButton>
                      <Modal.Title>Delete</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="delete-modal">
                      <p>Deleting Entry</p>
                      <p> Are you sure?</p>
                    </Modal.Body>
                    <Modal.Footer>
                      <Button variant="secondary" onClick={handleCloseDelete}>
                        Close
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => {
                          if (itemToDelete) {
                            deleteEntry(itemToDelete); // Pass the stored ID to delete
                          }
                          handleCloseDelete();
                        }}
                      >
                        Delete
                      </Button>
                    </Modal.Footer>
                  </Modal>
                </td>
                <td>
                  <Button
                    variant="warning"
                    onClick={() => handlePaymentReceived(salesDoc.id)}
                    disabled={salesDoc.paymentReceived}
                  >
                    $$Received
                  </Button>
                  {salesDoc.status === "Paid" && (
                    <Button
                      variant="danger"
                      onClick={() => generatePDF(salesDoc)}
                    >
                      Print
                    </Button>
                  )}
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
