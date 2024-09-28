import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import React, { useRef } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { app } from "../Firebase";

function Signin() {
  const emailRef = useRef();
  const passwordRef = useRef();

  const navigate = useNavigate();
  const auth = getAuth(app);

  function enter() {
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    signInWithEmailAndPassword(auth, email, password)
      .then((usercredential) => {
        const userId = usercredential.user.uid;
        console.log(userId);
        navigate("/Home");
      })
      .catch((error) => {
        const errorMessage = error.message;
        console.log(errorMessage);
      });
  }

  return (
    <div>
      <div className="box">
        <div className="profile"></div>
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
        <Button onClick={enter}>Sign In</Button>
        <p onClick={() => navigate("/")}>Don't have an account?</p>
      </div>
    </div>
  );
}

export default Signin;
