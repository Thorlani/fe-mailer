import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const Auto = () => {
  //Store the response from the file upload
  const [data, setData] = useState([]);
  //Store the senders from the file upload
  const [sender, setSender] = useState([]);
  //Store the recipients from the file upload
  const [recipient, setRecipient] = useState([]);
  //I want to use it to create a loader
  const [isActive, setIsActive] = useState(false);
  //to store the file being uploaded
  const [selectedFile, setSelectedFile] = useState(null);
  //to store the details of the form
  const [formData, setFormData] = useState({
    senderEmail: "davidthorlani@gmail.com",
    subject: "FOLLOW UP INSTRUCTIONS",
  });
  //Stores the response after a successful submission
  const [sentMailsReciept, setSentMailsReciept] = useState([]);

  //Body of the message
  const [message, setMessage] = useState("");

  //Post URL
  const url = `${import.meta.env.VITE_BASE_SEND_MAIL_API_URL}`;

  //HandleChange for the file upload inputs
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  //HandleChange for the form inputs
  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prevCredientials) => {
      return {
        ...prevCredientials,
        [name]: type === "checkbox" ? checked : value,
      };
    });
  };

  //The function that splits the sender and recipient from the data into their respective state
  useEffect(() => {
    setSender(
      data.filter(
        (item) =>
          item.Column1 !== "" && item.Column2 === "" && item.Column3 === ""
      )
    );
    setRecipient(
      data.filter((item) => item.Column1 !== "" && item.Column3 !== "")
    );
  }, [data]);

  //Logging out senders and recicients
  console.log(sender, recipient);

  //The function to upload the collected file
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

  //The function to send the submission
  const sendTheMails = (e) => {
    e.preventDefault();
    recipient.forEach((recipient, index) => {
      const senderName = sender[index]?.Column1;

      console.log("Mail Details", {
        senderEmail: formData?.senderEmail,
        senderName: senderName,
        recipientEmail: recipient?.Column3,
        recipientFirstname: recipient?.Column1,
        subject: formData.subject,
        message: message,
      });
      axios
        .post(url, {
          senderEmail: formData?.senderEmail,
          senderName: senderName,
          recipientEmail: recipient?.Column3,
          recipientFirstname: recipient?.Column1,
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
      <div style={{
        width: "200px",
        height: "fit-content",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <div>
          <p>
            sender: <span>{sender.length}</span>
          </p>
        </div>
        <div>
          <p>
            recipient: <span>{recipient.length}</span>
          </p>
        </div>
      </div>
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
