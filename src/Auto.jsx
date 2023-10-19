import { useState } from "react";
import "./App.css";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const Auto = () => {
  const [data, setData] = useState([]);
  const [isActive, setIsActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    senderName: "Chris Rebertson",
    senderEmail: "davidthorlani@gmail.com",
    subject: "FOLLOW UP INSTRUCTIONS",
  });
  const [sentMailsReciept, setSentMailsReciept] = useState([]);

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

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
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

  const handleFileUpload = () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);

      axios
        .post("http://localhost:7000/upload-csv", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          setData(response.data);
          setSelectedFile(null);
        })
        .catch((error) => {
          console.error("File upload failed:", error);
        });
    }
  };

  const sendTheMails = (e) => {
    e.preventDefault();
    data.map((mails) => {
      console.log("Mail Details", {
        senderName: formData.senderName,
        senderEmail: formData?.senderEmail,
        recipientEmail: mails?.EMAIL,
        recipientFirstname: mails?.FIRST_NAME,
        subject: formData.subject,
        message: message,
      });
      axios
        .post(url, {
          senderName: formData.senderName,
          senderEmail: formData?.senderEmail,
          recipientEmail: mails?.EMAIL,
          recipientFirstname: mails?.FIRST_NAME,
          subject: formData.subject,
          message: message,
        })
        .then((res) => {
          if (res.status === 200) {
            setSentMailsReciept(res.data);
          } else if (res.status === 404) {
            setSentMailsReciept("Failed to send to that mailbox");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    });
  };
  console.log(data);
  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <form style={{ width: "fit-content" }}>
        <div
          style={{
            width: "100%",
            height: "fit-content",
            display: "flex",
            flexDirection: "column",
            gap: "6px",
          }}
        >
          <input type="file" onChange={handleFileChange} />
          <button type="button" onClick={handleFileUpload}>
            Upload
          </button>
          <div className="first col">
            <div style={{ width: "100%" }} className="col">
              <label htmlFor="Firstname">Sender's name</label>
              <input
                type="text"
                name="senderName"
                value={formData.senderName}
                onChange={handleChange}
              />
            </div>
          </div>
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
      </form>
      <button
        style={{ width: "20%", marginTop: "20px" }}
        onClick={sendTheMails}
      >
        Run
      </button>

      <div style={{ width: "100%", minHeight: "fit-content" }}>
        <ul>
          {/* {sentMailsReciept.map((items, index) => {
            return <li key={index}>{items.messageId}</li>;
          })} */}
        </ul>
      </div>
    </div>
  );
};

export default Auto;
