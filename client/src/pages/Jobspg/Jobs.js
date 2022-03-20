import React, { useState, useEffect } from "react";
import { FaFilter } from "react-icons/fa";
import { Button } from "@material-ui/core";
import Dropdown from "react-bootstrap/Dropdown";
import "./Jobs.css";
// import Jobs from "../../images/service.png";
import CardWithBorder from "../../components/Cards/CardWithBorder";
import NavbarrAfterLogin from "../../components/Navbar/NavbarrAfterLogin";
import Footer from "../../components/Footer/Footer";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { Form, Spinner } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { storage } from "../../firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "1px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    width: "60%",
  },
}));

export default function Opportunitypg() {
  const [details, setDetails] = useState({
    name: "",
    batch: "",
    positionLink: "",
    image: "",
  });

  const [loader, setLoder] = useState(false);

  const [progress, setProgress] = useState(0);

  const [image, setImage] = useState(null);

  const [job, setJob] = useState([]);

  let name, value;

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleInput = (e) => {
    name = e.target.name;
    value = e.target.value;
    setDetails({ ...details, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoder(true);
    const storageRef = ref(storage, `job/${image.name}`);
    const uploadTask = uploadBytesResumable(storageRef, image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);
      },
      (error) => {
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          console.log(true);
          postCreated(url);
        });
      }
    );
  };

  const postCreated = async (url) => {
    const { name, batch, positionLink } = details;

    setLoder(true);
    const res = await fetch("/Jobs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        batch,
        positionLink,
        image: url,
      }),
    });
    const data = await res.json();

    if (!data || data.status === 422) {
      toast.error(" Filled The details", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setLoder(false);
      console.log("Please fill all the fields");
    } else {
      if (name && batch && positionLink) {
        alert("Job Created....");
        setLoder(false);
        setDetails({
          name: "",
          batch: "",
          positionLink: "",
        });
        console.log("Job posted successfully");

        handleClose();
      }
    }
  };
  const fetchData = async () => {
    const res = await fetch("/Jobs");
    const jobData = await res.json();
    if (jobData) {
      console.log(jobData);
      setJob(jobData);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <NavbarrAfterLogin />
      <div className="opp_header">
        <h1 className="opp_header_heading">Jobs</h1>
        <Button id="opp_header_button" onClick={handleOpen}>
          Post new Job
        </Button>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={classes.modal}
          open={open}
          onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={open}>
            <div className={classes.paper}>
              <h2
                id="transition-modal-title"
                style={{ marginBottom: "1.5rem" }}
              >
                Add New Job
              </h2>
              <Form
                onSubmit={handleSubmit}
                method="POST"
                encType="multipart/form-data"
              >
                <input
                  accept="image/*"
                  className={classes.input}
                  id="contained-button-file"
                  multiple
                  type="file"
                  onChange={handleImageChange}
                  required
                />

                <Form.Group className="mb-3" controlId="formBasicName">
                  <Form.Label style={{ marginBottom: "-1rem" }}>
                    Enter Title
                  </Form.Label>
                  <Form.Control
                    autoComplete="off"
                    value={details.name}
                    type="text"
                    name="name"
                    placeholder="Enter title..."
                    required
                    onChange={handleInput}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicBatch">
                  <Form.Label style={{ marginBottom: "-1rem" }}>
                    Batch Eligible
                  </Form.Label>
                  <Form.Control
                    autoComplete="off"
                    value={details.batch}
                    type="text"
                    name="batch"
                    placeholder="2023, 2024..."
                    required
                    onChange={handleInput}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicUrl">
                  <Form.Label style={{ marginBottom: "-1rem" }}>
                    Position Link
                  </Form.Label>
                  <Form.Control
                    autoComplete="off"
                    value={details.positionLink}
                    type="text"
                    name="positionLink"
                    placeholder="Enter position link..."
                    required
                    onChange={handleInput}
                  />
                </Form.Group>
                {loader ? (
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    style={{ display: "flex", margin: "auto" }}
                  >
                    <Spinner animation="border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    style={{ display: "flex", margin: "auto" }}
                  >
                    Create Post
                  </Button>
                )}
              </Form>
              <ToastContainer />
            </div>
          </Fade>
        </Modal>
        <div>
          <Dropdown>
            <Dropdown.Toggle
              variant="light"
              style={{
                backgroundColor: "#F4F4F4",
                border: "none",
                outline: "none",
                color: "black",
              }}
              id="dropdown-basic"
            >
              <FaFilter /> Filter
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item href="#/action-1">Company</Dropdown.Item>
              <Dropdown.Item href="#/action-2">Duration</Dropdown.Item>
              <Dropdown.Item href="#/action-3">Role</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
      <div className="job_posts">
        <div className="job_post_container">
          {job.map((item) => (
            <div className="card_container">
              <CardWithBorder
                width="20rem"
                key={item._id}
                image={item.image}
                title={item.name}
                content={
                  <div>
                    <p>Batch -{item.batch}</p>
                    <p>Posted on- {item.posted_Date}</p>
                    <Button
                      variant="contained"
                      color="primary"
                      href={item.positionLink}
                      target="_blank"
                    >
                      Apply here
                    </Button>
                  </div>
                }
              />
            </div>
          ))}
        </div>
      </div>
      <div className="foter_container">
        <Footer />
      </div>
    </div>
  );
}
