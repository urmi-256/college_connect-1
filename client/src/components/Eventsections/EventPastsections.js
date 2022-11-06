import React,{useState,useEffect} from 'react'
import DropdownButton from 'react-bootstrap/DropdownButton'
import { Button,Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { Dropdown } from 'react-bootstrap'
import './Eventsections.css'

const EventPastsections = (props) => {
  const [events,setEvents] = useState([]);
  var d = new Date();
var cnt=1;
  const fetchEvents = async () => {
    const res = await fetch(`/event`);
    // console.log(res)
    const data = await res.json();
    var cnt = 0;
    setEvents(data);
    //  console.log(data);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="event_section_container">
      <div className="event_section_inner_heading">
        <h2>{props.title}</h2>
        {/* <DropdownButton
          variant="secondary"
          id="dropdown-basic-button"
          title="Category"
        >
          <Dropdown.Item href="#/action-1">Sport</Dropdown.Item>
          <Dropdown.Item href="#/action-2">Tech</Dropdown.Item>
          <Dropdown.Item href="#/action-3">Webinar</Dropdown.Item>
        </DropdownButton> */}
      </div>
     {events?(
      <div className="event_card_container">
        {events.map((event) => {
          if (
            parseInt(event.date.substring(8, 10)) === d.getDate() &&
            parseInt(event.date.substring(5, 7)) === d.getMonth() + 1 &&
            parseInt(event.date.substring(0, 4)) === d.getFullYear()
          ) {
            if (
               parseInt(event.startTime.substring(0, 2)) > d.getHours() 
               )
               {
              // <Card
              //   style={{
              //     maxWidth: "20rem",
              //     borderRadius: "15px",
              //     margin: "1rem",
              //   }}
              // >
              //   <Card.Img variant="top" src={eventcard} />
              //   <Card.Body>
              //     <div className="event_card_content">
              //       <div>
              //         <Card.Title>Sep 18</Card.Title>
              //       </div>
              //       <div className="left_card_content">
              //         <Card.Title>
              //           <center>{event.name}</center>
              //         </Card.Title>
              //         <Card.Text>
              //           {event.description.substring(0, 100)}
              //         </Card.Text>
              //       </div>
              //     </div>
              //   </Card.Body>
              // </Card>
            }
              else if(
                parseInt(event.startTime.substring(0,2)) <= d.getHours()
              ){
                if(
                  parseInt(event.startTime.substring(0,2)) === d.getHours() &&
                  parseInt(event.startTime.substring(3,5)) > d.getMinutes()
                )
                {
                console.log(event);
                  console.log("Upcomming Event Date");
                  // <Card
                  //   style={{
                  //     maxWidth: "20rem",
                  //     borderRadius: "15px",
                  //     margin: "1rem",
                      
                  //   }}
                  // >
                  //   <Card.Img variant="top" src={eventcard} />
                  //   <Card.Body>
                  //     <div className="event_card_content">
                  //       <div>
                  //         <Card.Title>Sep 18</Card.Title>
                  //       </div>
                  //       <div className="left_card_content">
                  //         <Card.Title>
                  //           <center>{event.name}</center>
                  //         </Card.Title>
                  //         <Card.Text>
                  //           {event.description.substring(0, 100)}
                  //         </Card.Text>
                  //       </div>
                  //     </div>
                  //   </Card.Body>
                  // </Card>
              }
              else if(
                parseInt(event.startTime.substring(0,2)) < d.getHours() || (
                  parseInt(event.startTime.substring(0,2)) === d.getHours() &&
                  parseInt(event.startTime.substring(3,5)) < d.getMinutes()
                )
              )
              {
                 if(event.endTime.substring(0,2) > d.getHours())
                 {
            
                  // <Card
                  //   style={{
                  //     maxWidth: "20rem",
                  //     borderRadius: "15px",
                  //     margin: "1rem",
                  //   }}
                  // >
                  //   <Card.Img variant="top" src={eventcard} />
                  //   <Card.Body>
                  //     <div className="event_card_content">
                  //       <div>
                  //         <Card.Title>Sep 18</Card.Title>
                  //       </div>
                  //       <div className="left_card_content">
                  //         <Card.Title>
                  //           <center>{event.name}</center>
                  //         </Card.Title>
                  //         <Card.Text>
                  //           {event.description.substring(0, 100)}
                  //         </Card.Text>
                  //       </div>
                  //     </div>
                  //   </Card.Body>
                  // </Card>
               

                 }
                 else if(event.endTime.substring(0,2)< d.getHours()){
                 cnt=1;
                  return(
                    <Link className="event_card_link" to={`/EventInnerPage/${event._id}`}>
                    <Card
                      style={{
                        width: "20rem",
                        borderRadius: "15px",
                        margin:"1rem",
                        height:"25rem"
                      }}
                    >
                      <Card.Img variant="top" src={event.image} style={{ maxHeight:"10rem"}}/>
                      <Card.Body>
                        <div className="event_card_content">
                        <Card.Title>
                              <center>{event.name}</center>
                            </Card.Title>
                          <div className="event_card_date">
                            <strong>Date:</strong> {event.date && event.date.substring(8,10)} - {event.date.substring(5,7)} - {event.date.substring(2,4)}
                          
                            </div>
                            <div className="inner_card_content">
                            
                            <Card.Text>
                             {event.description.substring(0, 100)}
                            </Card.Text>
                          </div>
                          
                        </div>
                      </Card.Body>
                    </Card>
                    </Link>
                  )
                 }
              }
              else if(
                parseInt(event.startTime.substring(0,2)) === d.getHours() &&
                parseInt(event.startTime.substring(3,5)) === d.getMinutes()
              )
              {
             
                  // <Card 
                  //   style={{
                  //     maxWidth: "20rem",
                  //     borderRadius: "15px",
                  //     margin: "1rem",
                  //   }}
                  // >
                  //   <Card.Img variant="top" src={eventcard} />
                  //   <Card.Body>
                  //     <div className="event_card_content">
                  //       <div>
                  //         <Card.Title>Sep 18</Card.Title>
                  //       </div>
                  //       <div className="left_card_content">
                  //         <Card.Title>
                  //           <center>{event.name}</center>
                  //         </Card.Title>
                  //         <Card.Text>
                  //           {event.description.substring(0, 100)}
                  //         </Card.Text>
                  //       </div>
                  //     </div>
                  //   </Card.Body>
                  // </Card>
                
              }
            }

          }
          else if(
            parseInt(event.date.substring(0, 4)) < d.getFullYear() || 
            (parseInt(event.date.substring(0, 4)) === d.getFullYear() &&
            parseInt(event.date.substring(5, 7)) < d.getMonth() + 1) || 
            (
              parseInt(event.date.substring(0, 4)) === d.getFullYear() &&
              parseInt(event.date.substring(5, 7)) === d.getMonth() + 1 &&
              parseInt(event.date.substring(8, 10)) < d.getDate()
            )
            
          ){
            cnt=1;
           return(
            <Link className="event_card_link" to={`/EventInnerPage/${event._id}`}>
            <Card
              style={{
                width: "20rem",
                borderRadius: "15px",
                margin:"1rem",
                height:"25rem"
              }}
            >
              <Card.Img variant="top" src={event.image} style={{ maxHeight:"10rem"}}/>
              <Card.Body>
                <div className="event_card_content">
                <Card.Title>
                      <center>{event.name}</center>
                    </Card.Title>
                  <div className="event_card_date">
                    <strong>Date:</strong> {event.date && event.date.substring(8,10)} - {event.date.substring(5,7)} - {event.date.substring(2,4)}
                  
                    </div>
                    <div className="inner_card_content">
                    
                    <Card.Text>
                     {event.description.substring(0, 100)}
                    </Card.Text>
                  </div>
                  
                </div>
              </Card.Body>
            </Card>
            </Link>
           )
          }
          else {
            console.log(event);
            console.log("Upcomming Event Date");
            // <Card
            //   style={{
            //     maxWidth: "20rem",
            //     borderRadius: "15px",
            //     margin: "1rem",
            //   }}
            // >
            //   <Card.Img variant="top" src={eventcard} />
            //   <Card.Body>
            //     <div className="event_card_content">
            //       <div>
            //         <Card.Title>Sep 18</Card.Title>
            //       </div>
            //       <div className="left_card_content">
            //         <Card.Title>
            //           <center>{event.name}</center>
            //         </Card.Title>
            //         <Card.Text>
            //           {event.description.substring(0, 100)}
            //         </Card.Text>
            //       </div>
            //     </div>
            //   </Card.Body>
            // </Card>;
          }
        })}
            
      
      </div>):(<>No event present</>)}
      {/* <Button variant="secondary" className="card_button">
        View All
      </Button> */}
      {cnt === 0? <div className="no_event">No past Events</div>:<></>}
    </div>
  );
};

export default EventPastsections;
