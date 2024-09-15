import React, { useState } from "react";
import Logo from "../../assets/images/logo.svg";
import RegisterForm from "../../Components/Input/RegisterForm";
import RegisterButton from "../../Components/Button/RegisterButton";
import api from "../../API/api";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [gender, setGender] = useState(""); // Tambahkan state untuk gender
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/register", {
        name,
        username,
        email,
        password,
        password_confirmation: passwordConfirmation,
        gender, // Sertakan gender di request
      });

      const token = response.data.token;
      const userRole = response.data.data.role;

      localStorage.setItem("token", token);
      localStorage.setItem("role", userRole);

      navigate("/home");
    } catch (error) {
      console.error("Register error:", error);
      setError(error.response.data.message);
    }
  };

  return (
    <div className="w-screen h-screen flex mx-auto items-center justify-center">
      <div className="block text-center">
        <img src={Logo} alt="React Logo" className="mx-auto" />
        <h1 className="text-4xl font-bold mt-6">Create your account</h1>
        <p className="mt-4">
          Enter your details to create an account and start using the dashboard
        </p>

        <form onSubmit={handleRegister}>
          <div className="mt-7">
            <RegisterForm
              placeholder="Your Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="mt-5">
            <RegisterForm
              placeholder="Your Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="mt-5">
            <RegisterForm
              placeholder="Your Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mt-5">
            <RegisterForm
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="mt-5">
            <RegisterForm
              placeholder="Confirm Password"
              type="password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
            />
          </div>

          {/* Dropdown untuk memilih gender */}
          <div className="mt-5">
            <select
              className="border border-gray-300 p-2 rounded w-full"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              required
            >
              <option value="">Select Gender</option>
              <option value="men">Men</option>
              <option value="women">Women</option>
            </select>
          </div>

          <div className="mt-5">
            {error && <p className="text-red-500">{error}</p>}
            <RegisterButton type="submit" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
