import React, { useState, useEffect } from 'react';
import url from './url';
import GetActivities from './GetActivities';

function GetItineraries(props) {
    let tripOwner = props.tripOwner;
    let trip = props.trip;

    const [create, setCreate] = useState(false);
    const [itineraries, setItineraries] = useState([]);
    const [data, setData] = useState({
        date: "",
        startTime: "",
        endTime: ""
    });
    
    // Fetch requests
    useEffect(() => {
        if (!itineraries.length) {
            fetch(`${url}api/itineraries/?trip_id=${trip.id}`)
            .then((response) => response.json())
            .then((itinerariesData) => {
                if (itinerariesData.length) {
                    setItineraries(itinerariesData);
                }
            })
            .catch(err => console.log(err))
        }
    });

    /* ---------- Itinerary Functions ---------- */

    // Create Itinerary
    const handle = (e) => {
      const newData = {...data};
      newData[e.target.id] = e.target.value;
      setData(newData);
      console.log(newData);
    }

    const submitForm = (e) => {
      e.preventDefault();
      fetch(`${url}create-itinerary/`, {
          method: 'POST',
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({
              'tripID': trip.id,
              'date': data.date,
              'startTime': data.startTime,
              'endTime': data.endTime
          })
      })
      .then((response) => {
        console.log(response);
        return response.json();
      })
      .then((responseData) => {
        console.log(responseData);
      })
      .catch((err) => console.error("Error:", err));
    };
  
    const createItinerary = () => {
        return (
          <div style={{minHeight: '20rem', borderLeft: 'solid 1px grey', paddingLeft: '30px'}}>
              <form className="form-group" onSubmit={(e) => submitForm(e)} style={{width: '14rem'}}>
                  <label htmlFor="date">Date </label>
                  <input className="form-control" onChange={(e) => handle(e)} value={data.date} id="date" type='date'></input>
                  <br />
                  <label htmlFor="startTime">Start Time </label>
                  <input className="form-control" onChange={(e) => handle(e)} value={data.startTime} id="startTime" type='time'></input>
                  <br />
                  <label htmlFor="endTime">End Time </label>
                  <input className="form-control" onChange={(e) => handle(e)} value={data.endTime} id="endTime" type='time'></input>
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
        fetch(`${url}delete-itinerary/`, {
            method: 'POST',
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({
                'itineraryID': itinerary.id,
                'activities': itinerary.activities,
                'tripID': tripID
            })
        })
        .then((response) => {
          console.log(response); // Log the entire response
          return response.json();
        })
        .then((responseData) => {
          console.log(responseData);
            window.location.reload();
        })
        .catch((err) => console.error("Error:", err));
    }

    // Get Itineraries
    const getItineraries = () => {
        return itineraries.map(itinerary => (
            <div key={itinerary.id} className="card" style={{margin: '10px', minWidth: '28rem'}}>
                <div className="card-body">
                    <div style={{display: 'flex', justifyContent: 'space-between'}} className="card-title">
                        <h5>{itinerary.date}</h5>
                        {localStorage.getItem('sessionID') == tripOwner.id ? <button className="btn btn-danger" onClick={(e) => deleteItinerary(e, itinerary, trip.id)}>Delete</button> : ""}
                    </div>
                    <p className="card-text">{itinerary.start.slice(0, -3)} - {itinerary.end.slice(0, -3)}</p>
                    <br />
                    <GetActivities ids={itinerary.activities} />
                </div>
            </div>
          ));
    }

    // Render Itineraries
    return (
      <div>
          <div style={{display: 'flex', gap: '20px'}}>
            <h3>Itineraries</h3>
            {localStorage.getItem('sessionID') == tripOwner.id
            && !create
            && <button className='btn btn-secondary' onClick={() => setCreate(!create)}>Add Itinerary</button>}
          </div>
          <div style={{display: 'flex', gap: '5px'}}>
              <div style={{display: 'flex', overflowX: 'scroll'}}>
                  {getItineraries()}
              </div>
              {create && createItinerary()}
          </div>
      </div>
    )
}

export default GetItineraries