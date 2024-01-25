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
        <div key={trip.id} class="card" style={{width: '18rem', margin: '10px'}}>
          <div class="card-body">
            <h5 class="card-title">{trip.id} - {trip.tripname}</h5>
            <p class="card-text">{trip.location}</p>
            <button class="btn btn-secondary" onClick={() => {setSelected(trip)}}>View</button>
          </div>
        </div>
      ));
    };  

    useEffect(() => {
        if (trips == "") {
            fetch(`${url}api/trips/?owner=${localStorage.getItem('sessionID')}/`)
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
            <button class="btn btn-primary" onClick={() => setNewTrip(true)}>New Trip +</button>
            <br />
            <br />
            <div>
                {getTrips()}
            </div>
        </div>
    )
}

export default GetTrips