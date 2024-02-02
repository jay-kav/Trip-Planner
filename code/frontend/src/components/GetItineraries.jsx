import React, { useState, useEffect } from 'react';
import GetActivities from './GetActivities';
import axios from 'axios';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

const filterList = {
  'Breakfast': 'breakfast',
  'Lunch': 'lunch',
  'Dinner': 'dinner',
  'Walking': 'park',
  'History': 'museum',
  'Shopping': 'shopping_mall',
  'Zoo': 'zoo',
  'Aquarium': 'aquarium',
  'Amusement Park': 'amusement_park',
  'Bowling': 'bowling_alley',
  'Tourism': 'tourist_attraction',
  'Nightlife': 'night_club', 
};

let itineraryCount = 0;

function GetItineraries(props) {
    let tripOwner = props.tripOwner;
    let trip = props.trip;

    const [create, setCreate] = useState(false);
    const [itineraries, setItineraries] = useState([]);
    const [data, setData] = useState({
      date: "",
      startTime: "",
      endTime: "",
      breakfast: "false",
      lunch: "false",
      dinner: "false",
      park: "false",
      museum: "false",
      shopping_mall: "false",
      zoo: "false",
      aquarium: "false",
      amusement_park: "false",
      bowling_alley: "false",
      tourist_attraction: "false",
      night_club: "false"
    });
    
    // Fetch requests
    useEffect(() => {
        if (itineraryCount < 10) {
          axios.get(`api/itineraries/?trip_id=${trip.id}`)
          .then((response) => {
            console.log(response);
            setItineraries(response.data);
            itineraryCount += 1;
            console.log(itineraryCount);
          })
          .catch(err => console.log(err))
        }
    });

    /* ---------- Itinerary Functions ---------- */

    // Create Itinerary
    const handle = (e) => {
      const newData = {...data};
      if (newData[e.target.id].value == "false") {
        newData[e.target.id] = "true";
      } else if (newData[e.target.id].value == "true") {
        newData[e.target.id] = "false";
      } else {
        newData[e.target.id] = e.target.value;
      }
      setData(newData);
      console.log(newData);
    }

    const submitForm = (e) => {
      e.preventDefault();
      axios.post(`create-itinerary/`, {
        'tripID': trip.id,
        'date': data.date,
        'startTime': data.startTime,
        'endTime': data.endTime
      })
      .then((response) => {
        console.log(response);
        window.location.reload();
      })
      .catch((err) => console.error("Error:", err));
    };
  
    const createItinerary = () => {
        return (
          <div style={{minHeight: '20rem', borderLeft: 'solid 1px grey', paddingLeft: '30px'}}>
              <form className="form-group" onSubmit={(e) => submitForm(e)} style={{width: '14rem'}}>
                  <div style={{display: 'flex', gap: '30px'}}>
                    <div>
                      <label htmlFor="date">Date </label>
                      <input className="form-control" onChange={(e) => handle(e)} value={data.date} id="date" type='date'></input>
                      <br />
                      <label htmlFor="startTime">Start Time </label>
                      <input className="form-control" onChange={(e) => handle(e)} value={data.startTime} id="startTime" type='time'></input>
                      <br />
                      <label htmlFor="endTime">End Time </label>
                      <input className="form-control" onChange={(e) => handle(e)} value={data.endTime} id="endTime" type='time'></input>
                    </div>
                    <div style={{paddingLeft: '20px', display: 'grid', gridTemplateColumns: 'auto', justifyContent: 'space-between'}}>
                      <label style={{marginRight: '5px'}} for="breakfast">Breakfast</label>
                      <input onChange={(e) => handle(e)} value={data.breakfast} className="form-check-input" id='breakfast' type='checkbox' />
                      <br />
                      <label style={{marginRight: '5px'}} for="lunch">Lunch</label>
                      <input onChange={(e) => handle(e)} value={data.lunch} className="form-check-input" id='lunch' type='checkbox' />
                      <br />
                      <label style={{marginRight: '5px'}} for="dinner">Dinner</label>
                      <input onChange={(e) => handle(e)} value={data.dinner} className="form-check-input" id='dinner' type='checkbox' />
                      <br />
                      <label style={{marginRight: '5px'}} for="park">Parks</label>
                      <input onChange={(e) => handle(e)} value={data.park} className="form-check-input" id='park' type='checkbox' />
                      <br />
                      <label style={{marginRight: '5px'}} for="museum">Museum</label>
                      <input onChange={(e) => handle(e)} value={data.museum} className="form-check-input" id='museum' type='checkbox' />
                      <br />
                      <label style={{marginRight: '5px'}} for="shopping">Shopping</label>
                      <input onChange={(e) => handle(e)} value={data.shopping} className="form-check-input" id='shopping' type='checkbox' />
                      <br />
                      <label style={{marginRight: '5px'}} for="zoo">Zoo</label>
                      <input onChange={(e) => handle(e)} value={data.zoo} className="form-check-input" id='zoo' type='checkbox' />
                      <br />
                      <label style={{marginRight: '5px'}} for="aquarium">Aquarium</label>
                      <input onChange={(e) => handle(e)} value={data.aquarium} className="form-check-input" id='aquarium' type='checkbox' />
                      <br />
                      <label style={{marginRight: '5px'}} for="amusement_park">Amusement Park</label>
                      <input onChange={(e) => handle(e)} value={data.amusement_park} className="form-check-input" id='amusement_park' type='checkbox' />
                      <br />
                      <label style={{marginRight: '5px'}} for="bowling">Bowling</label>
                      <input onChange={(e) => handle(e)} value={data.bowling} className="form-check-input" id='bowling' type='checkbox' />
                      <br />
                      <label style={{marginRight: '5px'}} for="tourism">Tourism</label>
                      <input onChange={(e) => handle(e)} value={data.tourism} className="form-check-input" id='tourism' type='checkbox' />
                      <br />
                      <label style={{marginRight: '5px'}} for="nightlife">Nightlife</label>
                      <input onChange={(e) => handle(e)} value={data.nightlife} className="form-check-input" id='nightlife' type='checkbox' />
                    </div>
                  </div>
                  <br />
                  <div style={{display: 'flex', gap: '5px'}}>
                    <button className="btn btn-primary" type='submit'>Create Itinerary</button>
                    <button className='btn btn-secondary' onClick={() => setCreate(!create)} >Cancel</button>
                  </div>
              </form>
          </div>
    )};

    // Delete Itinerary
    const deleteItinerary = (e, itinerary, tripID) => {
        e.preventDefault();
        axios.post(`delete-itinerary/`, {
            'itineraryID': itinerary.id,
            'activities': itinerary.activities,
            'tripID': tripID
        })
        .then((response) => {
          console.log(response); // Log the entire response
          window.location.reload();
        })
        .catch((err) => console.error("Error:", err));
    }

    // Get Itineraries
    const getItineraries = () => {
        console.log(itineraries);
        return itineraries.map(itinerary => (
            <div key={itinerary.id} className="card" style={{margin: '10px', minWidth: '28rem', height: '90%'}}>
                <div className="card-body">
                    <div style={{display: 'flex', justifyContent: 'space-between'}} className="card-title">
                        <h5>{itinerary.date}</h5>
                        {localStorage.getItem('sessionID') == tripOwner.id && <DeleteOutlineIcon titleAccess="Delete Itinerary" onClick={(e) => deleteItinerary(e, itinerary, trip.id)} />}
                    </div>
                    <br />
                    <ul className='list-group' style={{overflowY: 'scroll', height: '80%', border: 'solid grey 1px'}}>
                      <GetActivities ids={itinerary.activities} />
                    </ul>
                </div>
            </div>
          ));
    }

    // Render Itineraries
    return (
      <div>
          <div style={{display: 'flex', gap: '45%', margin: '0 15px'}}>
            <h4>Itineraries</h4>
            {localStorage.getItem('sessionID') == tripOwner.id
            && !create
            && <button className='btn btn-secondary' onClick={() => setCreate(!create)}>Add Itinerary</button>}
          </div>
          <div style={{display: 'flex', gap: '5px'}}>
              <div>
                  {getItineraries()}
              </div>
              {create && createItinerary()}
          </div>
      </div>
    )
}

export default GetItineraries