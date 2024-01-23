import React, { useState, useEffect } from 'react';
import CreateTrip from './CreateTrip';
import CreateItinerary from './CreateItinerary';
import url from './url';

function GetTrips() {
    const [trips, setTrips] = useState([]);
    //const [createTrip, setCreateTrip] = useState(false);
  
    const getTrips = () => {
      return trips.map(trip => (
        <div key={trip.id}>
            <h3>{trip.id} - {trip.tripname}</h3>
            <p>{trip.location}</p>
            <button>View</button>
        </div>
      ));
    };  
  
    useEffect(() => {
        fetch(`${url}api/trips/`)
        .then((response) => response.json())
        .then((data) => {
            setTrips(data);
        })
        .catch(err => console.log(err))
    }, []);
  
    return (
        <div>
            <h1>My Trips</h1>
            <div>
                {getTrips()}
            </div>
        </div>
    )
}

export default GetTrips