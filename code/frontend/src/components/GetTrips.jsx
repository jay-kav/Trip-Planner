import React, { useState, useEffect } from 'react';
import url from './url';
import ViewTrip from './ViewTrip';
import CreateTrip from './CreateTrip';

function GetTrips() {
    const [trips, setTrips] = useState([]);
    const [selected, setSelected] = useState(null);
    const [newTrip, setNewTrip] = useState(false);

    const getTrips = () => {
      return trips.map(trip => (
        <div key={trip.id}>
            <h3>{trip.id} - {trip.tripname}</h3>
            <p>{trip.location}</p>
            <button onClick={() => {setSelected(trip)}}>View</button>
        </div>
      ));
    };  

    useEffect(() => {
        if (trips == "") {
            fetch(`${url}api/trips/?members=${url}${localStorage.getItem('sessionID')}/`)
            .then((response) => response.json())
            .then((data) => {
                setTrips(data);
            })
            .catch(err => console.log(err))
        }
    });

    if (newTrip) {
        return (
            <CreateTrip />
        )
    }
    if (selected) {
        return (
            <ViewTrip trip={selected} />
        )
    }
    return (
        <div>
            <h1>All Trips</h1>
            <br />
            <button onClick={() => setNewTrip(true)}>New Trip</button>
            <div>
                {getTrips()}
            </div>
        </div>
    )
}

export default GetTrips