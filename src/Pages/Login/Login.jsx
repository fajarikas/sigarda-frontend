import React, { useState } from "react";
import Logo from "../../assets/images/logo.svg";
import LoginForm from "../../Components/Input/LoginForm";
import LoginButton from "../../Components/Button/LoginButton";
import api from "../../API/api";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/login", {
        email,
        password,
      });

      const token = response.data.token;

      // console.log("token:", token);
      localStorage.setItem("token", token);

      navigate("/home");
    } catch (error) {
      console.error("Login error:", error);
      setError(error.response.data.message);
    }
  };

  return (
    <div className="w-screen h-screen flex mx-auto items-center justify-center">
      <div className="block text-center">
        <img src={Logo} alt="React Logo" s className="mx-auto" />
        <h1 className="text-4xl font-bold mt-6">Sign in to your dashboard</h1>
        <p className="mt-4">
          Enter your email address and password to continue
        </p>

        <form onSubmit={handleLogin}>
          <div className="mt-7 ">
            <LoginForm
              placeholder="admin@company.com"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mt-5">
            <LoginForm
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="mt-5">
            {error && <p className="text-red-500">{error}</p>}
            <LoginButton type="submit" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
