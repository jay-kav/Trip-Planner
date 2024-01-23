import React, { useState, useEffect } from 'react';
import CreateTrip from './CreateTrip';
import CreateItinerary from './CreateItinerary';

function ViewTrips() {
    const url = "http://127.0.0.1:8000/"
    const [trips, setTrips] = useState([]);
    const [createTrip, setCreateTrip] = useState(false);
  
    const getTrips = () => {
      return trips.map(trip => (
        <div key={trip.id}>
            <h3>{trip.tripname}</h3>
            <p>{trip.location}</p>
        </div>
      ));
    };  
  
    useEffect(() => {
      if (trips.length === 0) {
          fetch(url + "api/trips/")
          .then((response) => response.json())
          .then((data) => {
              setTrips(data);
          })
          .catch(err => console.log(err))
      }
    });
  
    return (
        <div>
            <h1>My Trips</h1>
            <button>Add New Trip</button>
            <CreateTrip />
            <CreateItinerary />
            <div>
                {getTrips()}
            </div>
        </div>
    )
}

export default ViewTrips