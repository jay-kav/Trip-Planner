import React, { useState, useEffect } from 'react';
import ViewTrip from './ViewTrip';
import axios from 'axios';

function GetTrips() {
    const [trips, setTrips] = useState([]);
    const [selected, setSelected] = useState(null);

    const getTrips = () => {
      return trips.map(trip => (
        <div key={trip.id} className="card" style={{width: '18rem', margin: '10px'}}>
          <div className="card-body">
            <h5 className="card-title">{trip.id} - {trip.tripname}</h5>
            <p className="card-text">{trip.location}</p>
            <button className="btn btn-secondary" onClick={() => {setSelected(trip)}}>View</button>
          </div>
        </div>
      ));
    };  

    useEffect(() => {
        axios.get(`api/trips/?sessionID=${localStorage.getItem('sessionID')}`)
        .then((response) => {
            console.log(response);
            setTrips(response.data);
        })
        .catch(err => console.log(err))
    }, []);

    if (selected) {
        return (
            <ViewTrip trip={selected} />
        )
    }
    return (
        <div>
            <h1>All Trips</h1>
            <br />
            <button className="btn btn-primary" onClick={() => window.location.href='/createtrip'}>New Trip +</button>
            <br />
            <br />
            <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-evenly'}}>
                {getTrips()}
            </div>
        </div>
    )
}

export default GetTrips