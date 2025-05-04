import React, { useState, useEffect } from "react";
import "./Auth.css";
import { useAuth } from "../../AuthContext";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { currentUser, setCurrentUser } = useAuth();

  useEffect(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("userID");
    setCurrentUser(null);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post("http://localhost:8080/User/login", {
        email: email,
        password: password,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userID", res.data.userID);

      setCurrentUser(res.data.userID);
      setLoading(false);
      window.location.href = "/";
    } catch (error) {
      console.error(error);
      alert("Login Failed");
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
          <h3 className="mt-2">Login to codeHub</h3>
        </div>
        <form>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Email address
            </label>
            <input
              type="email"
              className="form-control"
              id="username"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </div>
          <div className="mb-3">
            <label
              htmlFor="password"
              className="form-label d-flex justify-content-between"
            >
              Password
              {/* <a href="#" className="text-decoration-none">
                Forgot password?
              </a> */}
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-success w-100"
            onClick={handleLogin}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <div className="text-center mt-3">
          <p className="mb-0">
            New to codeHub?{" "}
            <a href="/signup" className="text-decoration-none">
              Create an account
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
