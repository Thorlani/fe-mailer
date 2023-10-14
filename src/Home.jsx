import { useState } from "react";
import "./App.css";
import axios from "axios";
import { RotatingLines } from "react-loader-spinner";
import PREV from "./assets/prev.png";

const Home = () => {
  const [loader, setLoader] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const [formStage, setFormStage] = useState(0);
  const [formData, setFormData] = useState({
    senderFirstName: "",
    senderLastName: "",
    recipientEmail: "",
    recipientFirstname: "",
    subject: "",
    message: "",
  });

  const url = `${import.meta.env.VITE_BASE_SEND_MAIL_API_URL}`;
  const formDetails = {
    senderFirstName: formData.senderFirstName,
    senderLastName: formData.senderLastName,
    recipientEmail: formData.recipientEmail,
    recipientFirstname: formData.recipientFirstname,
    subject: formData.subject,
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
      formData.message === "" ||
      formData.subject === "" ||
      formData.senderFirstName === "" ||
      formData.senderLastName === "" ||
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
              senderFirstName: "",
              senderLastName: "",
              recipientEmail: "",
              recipientFirstname: "",
              subject: "",
              message: "",
            });
            setFormStage(0);
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
      {formStage === 0 ? (
        <form>
          <div className="second">
            <div className="col">
              <label htmlFor="Firstname">Sender's first name</label>
              <input
                type="text"
                name="senderFirstName"
                value={formData.senderFirstName}
                onChange={handleChange}
              />
            </div>
            <div className="col">
              <label htmlFor="Lastname">Sender's last name</label>
              <input
                type="text"
                name="senderLastName"
                value={formData.senderLastName}
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
          <button onClick={() => setFormStage(1)} type="button">
            <p>Next</p>
          </button>
        </form>
      ) : (
        <form>
          <div
            style={{
              width: "100%",
              height: "fit-content",
              display: "flex",
              justifyContent: "end",
              alignItems: "end",
            }}
            onClick={()=>setFormStage(0)}
          >
            <div
              style={{
                padding: "5px",
                backgroundColor: "white",
                width: "fit-content",
                height: "fit-content",
                borderRadius: "50%"
              }}
            >
              <img src={PREV} alt="previous button" width={18} height={18} />
            </div>
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
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
            />
          </div>
          <button onClick={handleSubmit} type="button">
            <p>Submit</p>
          </button>
          {errorMessage && (
            <p style={{ color: "red" }}>An error occurred with the network</p>
          )}
        </form>
      )}
    </div>
  );
};

export default Home;
