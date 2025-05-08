import React from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav>
      <div>
        <Link to={"/"}>
          <img src="/logo/react.svg" alt="image" width={"50px"} />
          <h1>codeHub</h1>
        </Link>
      </div>
      <div>
        <Link to={"/create"}>
          <p> Create a Repository</p>
        </Link>
        <Link to={"/user"}>
          <p>Profile</p>
        </Link>
      </div>
    </nav>
  );
}
