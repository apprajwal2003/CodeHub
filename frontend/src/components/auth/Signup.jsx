import React, { useState } from "react";
import "./Auth.css";
import { useAuth } from "../../AuthContext";
import axios from "axios";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { currentUser, setCurrentUser } = useAuth();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post("http://localhost:8080/User/signup/", {
        email: email,
        password: password,
        username: username,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userID", res.data.userID);

      setCurrentUser(res.data.userID);
      setLoading(false);

      window.location.href = "/";
    } catch (error) {
      console.error(error);
      alert("Signup Failed");
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center vh-100">
      <div
        className="card p-4 shadow"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <div className="text-center mb-4">
          <img
            src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
            alt="GitHub Logo"
            width="50"
            height="50"
          />
          <h3 className="mt-2">Signup to codeHub</h3>
        </div>
        <form>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              type="text"
              className="form-control"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email address
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="form-text">
              Make sure it's at least 15 characters OR at least 8 characters
              including a number and a lowercase letter.
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-success w-100"
            onClick={handleSignup}
          >
            {loading ? "Trying to singup..." : "Sign up"}
          </button>
        </form>
        <div className="text-center mt-3">
          <p className="mb-0">
            Already have an account?{" "}
            <a href="/login" className="text-decoration-none">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
