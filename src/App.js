import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Signup from "./Pages/Signup";
import Signin from "./Pages/Signin";
import Home from "./Pages/Home";
import Inventroy from "./Pages/Inventroy";
import Sales from "./Pages/Sales";
import Boss from "./Pages/Boss";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Signup />} />
          <Route path="/Signin" element={<Signin />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/Inventroy" element={<Inventroy />} />
          <Route path="/Sales" element={<Sales />} />
          <Route path="/Boss" element={<Boss />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
