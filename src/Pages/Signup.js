import React, { useRef } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { app, db } from "../Firebase";
import { doc, setDoc } from "firebase/firestore";

function Signup() {
  const userNameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();

  const auth = getAuth(app);
  const navigate = useNavigate();

  function getin() {
    const person = userNameRef.current.value;
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    createUserWithEmailAndPassword(auth, email, password).then(
      (usercredential) => {
        const userId = usercredential.user.uid;
        console.log(userId);

        const userDoc = doc(db, "clients-Data", userId);

        setDoc(userDoc, {
          user: person,
          email: email,
          userId: userId,
        })
          .then(() => {
            // window.location.reload();
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
    <div className="signup">
      <div className="box">
        <div className="profile">
          <button>Ad</button>
        </div>
        <Form.Group>
          <Form.Label></Form.Label>
          <Form.Control
            className="bar"
            type="text"
            ref={userNameRef}
            placeholder="john john"
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
        <Button onClick={getin}>Sign Up</Button>
        <p onClick={() => navigate("/Signin")}>Don't have an account?</p>
      </div>
    </div>
  );
}

export default Signup;
