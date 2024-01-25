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
        if (!trips.length) {
            fetch(`${url}api/trips/?owner=${localStorage.getItem('sessionID')}`)
            .then((response) => response.json())
            .then((data) => {
                if (data.length) {
                    setTrips(data);
                }
            })
            .catch(err => console.log(err))
        }
    }, [trips]);

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
            <button className="btn btn-primary" onClick={() => setNewTrip(true)}>New Trip +</button>
            <br />
            <br />
            <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-evenly'}}>
                {getTrips()}
            </div>
        </div>
    )
}

export default GetTrips