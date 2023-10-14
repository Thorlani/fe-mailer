import { useState } from "react";
import "./App.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { RotatingLines } from "react-loader-spinner";

const SignIn = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [loader, setLoader] = useState(false);

  const credentialDetails = {
    email: credentials.email,
    password: credentials.password,
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setCredentials((prevCredientials) => {
      return {
        ...prevCredientials,
        [name]: type === "checkbox" ? checked : value,
      };
    });
  };

  const url = `${import.meta.env.VITE_BASE_LOGIN_API_URL}`;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (credentials.email === "" || credentials.password === "") {
      alert("Please complete your credentials.");
    } else {
      setLoader(true);
      axios
        .post(url, credentialDetails)
        .then((res) => {
          if (res.status === 200) {
            setLoader(false);
            localStorage.setItem("isLoggedIn", "true");
            navigate("/home");
          }
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <div className="container">
      {loader && (
        <div className="loaderContainer">
          <RotatingLines
            strokeColor="grey"
            strokeWidth="5"
            animationDuration="0.75"
            width="96"
            visible={true}
          />
        </div>
      )}
      <h1>Sign-In</h1>
      <form>
        <div className="first col">
          <label htmlFor="Email">Email</label>
          <input
            type="email"
            name="email"
            value={credentials.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="first col">
          <label htmlFor="Password">Password</label>
          <input
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            required
          />
        </div>
        <button onClick={handleSubmit} type="button">
          Enter
        </button>
      </form>
    </div>
  );
};

export default SignIn;
