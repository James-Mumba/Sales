import React, { useRef, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { app, db } from "../Firebase";
import { doc, setDoc } from "firebase/firestore";
import { faFileImage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Signup() {
  const userNameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const [isAdmin /*setIsAdmin*/] = useState(false); // State to handle admin checkbox

  const auth = getAuth(app);
  const navigate = useNavigate();

  // Function to handle sign-up
  function getin() {
    const person = userNameRef.current.value;
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    createUserWithEmailAndPassword(auth, email, password).then(
      (usercredential) => {
        const userId = usercredential.user.uid;
        console.log(userId);

        // Determine the role based on the checkbox or email condition
        const role =
          isAdmin || email === "admin@example.com" ? "admin" : "user"; // Example admin condition

        // Create a document for the new user in Firestore
        const userDoc = doc(db, "clients-Data", userId);

        // Add user data and role to Firestore
        setDoc(userDoc, {
          user: person,
          email: email,
          userId: userId,
          role: role, // Adding the user's role to Firestore
        })
          .then(() => {
            // Navigate to the Home page after sign-up
            navigate("/Home");
          })
          .catch((error) => {
            const errorMessage = error.message;
            console.log(errorMessage);
          });
      }
    );
  }

  return (
    <div className="sign">
      <div className="box">
        <div className="profile">
          <button>
            {" "}
            <FontAwesomeIcon className="log" icon={faFileImage} />
          </button>
        </div>
        <Form.Group>
          <Form.Label></Form.Label>
          <Form.Control
            className="bar"
            type="text"
            ref={userNameRef}
            placeholder="John Doe"
          />
        </Form.Group>
        <br />
        <Form.Group>
          <Form.Label></Form.Label>
          <Form.Control
            className="bar"
            type="email"
            ref={emailRef}
            placeholder="name@gmail.com"
          />
        </Form.Group>
        <br />
        <Form.Group>
          <Form.Label></Form.Label>
          <Form.Control
            className="bar"
            type="password"
            ref={passwordRef}
            placeholder="******"
          />
        </Form.Group>
        <br />
        {/* Checkbox to mark the user as admin */}
        {/* <Form.Group controlId="formIsAdmin" className="mt-3">
          <Form.Check
            type="checkbox"
            label="Register as Admin"
            checked={isAdmin}
            onChange={() => setIsAdmin(!isAdmin)}
          />
        </Form.Group>
        <br /> */}
        <Button onClick={getin}>Sign Up</Button>
        <p onClick={() => navigate("/Signin")}>Already have an account?</p>
      </div>
    </div>
  );
}

export default Signup;
