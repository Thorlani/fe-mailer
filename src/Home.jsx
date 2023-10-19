import { useState } from "react";
import "./App.css";
import axios from "axios";
import { RotatingLines } from "react-loader-spinner";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const Home = () => {
  const [loader, setLoader] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const [formData, setFormData] = useState({
    senderName: "",
    senderEmail: "davidthorlani@gmail.com",
    recipientEmail: "",
    recipientFirstname: "",
    subject: "",
  });

  const [message, setMessage] = useState("");

  const url = `${import.meta.env.VITE_BASE_SEND_MAIL_API_URL}`;
  const formDetails = {
    senderName: formData.senderName,
    senderEmail: formData.senderEmail,
    recipientEmail: formData.recipientEmail,
    recipientFirstname: formData.recipientFirstname,
    subject: formData.subject,
    message: message,
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prevCredientials) => {
      return {
        ...prevCredientials,
        [name]: type === "checkbox" ? checked : value,
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      message === "" ||
      formData.subject === "" ||
      formData.senderName === "" ||
      formData.recipientEmail === "" ||
      formData.recipientFirstname === ""
    ) {
      alert("Please fill in all the fields");
    } else {
      setLoader(true);
      axios
        .post(url, formDetails)
        .then((res) => {
          if (res.status === 200) {
            setLoader(false);
            setFormData({
              ...formData,
              senderName: "",
              recipientEmail: "",
              recipientFirstname: "",
            });
          } else if (res.status === 404) {
          }
        })
        .catch((err) => {
          setLoader(false);
          setErrorMessage(true);
          console.log(err);
        });
    }
  };

  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
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
      <h1>Mailer</h1>
      <form>
        <div className="second">
          <div style={{width: "100%"}} className="col">
            <label htmlFor="Firstname">Sender's name</label>
            <input
              type="text"
              name="senderName"
              value={formData.senderName}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="second">
          <div className="col">
            <label htmlFor="Firstname">Recipient email</label>
            <input
              type="text"
              name="recipientEmail"
              value={formData.recipientEmail}
              onChange={handleChange}
            />
          </div>
          <div className="col">
            <label htmlFor="Lastname">Recipient first name</label>
            <input
              type="text"
              name="recipientFirstname"
              value={formData.recipientFirstname}
              onChange={handleChange}
            />
          </div>
        </div>
        <button onClick={handleSubmit} type="button">
          <p>Submit</p>
        </button>
        {errorMessage && (
          <p style={{ color: "red" }}>An error occurred with the network</p>
        )}
        <div style={{ marginTop: "10px" }} className="first">
          <div className="accordion-header" onClick={toggleAccordion}>
            <span>Show email content</span>
            <i
              style={{ transform: !isOpen ? "rotate(-90deg)" : "rotate(0deg)" }}
              className={`icon ${isOpen ? "open" : ""}`}
            >
              &#9660;
            </i>
          </div>
          <div
            style={{
              width: "100%",
              height: "fit-content",
              display: isOpen ? "flex" : "none",
              flexDirection: "column",
              gap: "8px",
              margin: "15px 0px",
            }}
          >
            <div className="first col">
              <label htmlFor="subject">Sender's email</label>
              <input
                type="email"
                name="senderEmail"
                value={formData.senderEmail}
                onChange={handleChange}
              />
            </div>
            <div className="first col">
              <label htmlFor="subject">Subject Matter</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
              />
            </div>
            <div className="first col">
              <label htmlFor="message">Message</label>
              <ReactQuill
                style={{ fontFamily: "Helvetica" }}
                className="textarea"
                theme="snow"
                value={message}
                onChange={setMessage}
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Home;
