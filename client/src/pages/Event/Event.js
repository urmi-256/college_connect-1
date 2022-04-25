import React, { useState, useEffect } from "react";
import Banner from "../../components/Banner/Banner";
import NavbarrAfterLogin from "../../components/Navbar/NavbarrAfterLogin";
import eventBanner from "../../images/eventBanner.png";
import Eventsections from "../../components/Eventsections/Eventsections";
import Footer from "../../components/Footer/Footer";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { storage } from "../../firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { Form, Spinner } from "react-bootstrap";
import Fade from "@material-ui/core/Fade";
import Backdrop from "@material-ui/core/Backdrop";

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

const Event = () => {
  const [details, setDetails] = useState({
    name: "",
    description: "",
    date: "",
    time: "",
    image: "",
    category: "",
  });

  let value, name;

  const [loader, setLoder] = useState(false);
  const [progress, setProgress] = useState(0);
  const [image, setImage] = useState(null);
  const [events, setEvent] = useState([]);

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
    const storageRef = ref(storage, `Events/${image.name}`);
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
          postCreated(url);
        });
      }
    );
  };

  const postCreated = async (url) => {
    const { name, description, date, startTime, endTime, category } = details;

    setLoder(true);
    const res = await fetch("/event", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        description,
        date,
        startTime,
        endTime,
        image: url,
        category,
      }),
    });
    const data = await res.json();

    console.log(data);

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
      if (name && description && category && startTime && endTime && date) {
        alert("Event Created....");
        setLoder(false);
        setDetails({
          name: "",
          description: "",
          category: "",
          startTime: "",
          endTime: "",
          date: "",
        });
        console.log("Event Successfully Created....");

        handleClose();
      }
    }
  };
  const fetchData = async () => {
    const res = await fetch("/event");
    const eventData = await res.json();
    if (eventData) {
      console.log(eventData);
      setEvent(eventData);
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
    <>
      <NavbarrAfterLogin />
      <div className="event_container">
        <div className="event_carousel">
          <Banner image={eventBanner} />
        </div>
        <div className="Event_create_btn">
          <Button
            variant="contained"
            color="secondary"
            style={{ display: "flex", margin: "3rem auto auto auto" }}
            onClick={handleOpen}
          >
            Create an Event
          </Button>
        </div>

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
                Add New Event
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
                    Enter Name
                  </Form.Label>
                  <Form.Control
                    autoComplete="off"
                    value={details.name}
                    type="text"
                    name="name"
                    placeholder="Enter Name..."
                    required
                    onChange={handleInput}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicDescription">
                  <Form.Label style={{ marginBottom: "-1rem" }}>
                    Description
                  </Form.Label>
                  <Form.Control
                    autoComplete="off"
                    value={details.description}
                    type="text"
                    name="description"
                    placeholder="Enter Description..."
                    required
                    onChange={handleInput}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicDate">
                  <Form.Label style={{ marginBottom: "-1rem" }}>
                    Date
                  </Form.Label>
                  <Form.Control
                    autoComplete="off"
                    value={details.date}
                    type="date"
                    name="date"
                    required
                    onChange={handleInput}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicStartTime">
                  <Form.Label style={{ marginBottom: "-1rem" }}>
                    Start Time
                  </Form.Label>
                  <Form.Control
                    autoComplete="off"
                    value={details.startTime}
                    type="time"
                    name="startTime"
                    required
                    onChange={handleInput}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEndTime">
                  <Form.Label style={{ marginBottom: "-1rem" }}>
                    End Time
                  </Form.Label>
                  <Form.Control
                    autoComplete="off"
                    value={details.endTime}
                    type="time"
                    name="endTime"
                    required
                    onChange={handleInput}
                  />
                </Form.Group>

                <Form.Group controlId="formBasicSelect">
                  <Form.Label>Category</Form.Label>
                  <Form.Control
                    as="select"
                    value={details.category}
                    name="category"
                    onChange={handleInput}
                  >
                    <option value="Alumni">Sport</option>
                    <option value="Faculty">Tech</option>
                    <option value="Student">Webinar</option>
                  </Form.Control>
                </Form.Group>
                {loader ? (
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    style={{ display: "flex", margin: "2rem auto auto auto" }}
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
                    style={{ display: "flex", margin: "2rem auto auto auto" }}
                  >
                    Create Event
                  </Button>
                )}
              </Form>
              <ToastContainer />
            </div>
          </Fade>
        </Modal>

        <div className="event_inside_sections">
          <Eventsections title="Upcomming Events" />
          {/* <Eventsections title="Live Events" />
          <Eventsections title="Past Events" /> */}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Event;
