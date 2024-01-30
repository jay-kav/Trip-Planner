import React, { useState, useEffect } from 'react';
import ViewTrip from './ViewTrip';
import axios from 'axios';
import Navbar from './Navbar';

function GetTrips() {
    const [trips, setTrips] = useState([]);
    const [selected, setSelected] = useState(null);

    const getTrips = () => {
      return trips.map(trip => (
        <div key={trip.id} className="card" style={{margin: '10px 30px'}}>
          <div className="card-body">
            { trip.owner != localStorage.getItem('sessionID') ? <h5 className="card-title">{trip.tripname}</h5>
            : <div style={{display: 'flex', justifyContent: 'space-between'}}>
              <h5 className="card-title">{trip.tripname}</h5>
              <p className="card-text">Owner</p>
            </div>}
            <p className="card-text">{trip.location}</p>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
              <button className="btn btn-secondary" onClick={() => {setSelected(trip)}}>View</button>
              <p className="card-text" style={{paddingTop: '10px'}}>Members: {trip.members.length}</p>
            </div>
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
        <div style={{display: 'flex'}}>
            <Navbar />
            <div>
              <h1>All Trips</h1>
              <br />
              <button className="btn btn-primary" onClick={() => window.location.href='/createtrip'}>New Trip +</button>
              <br />
              <br />
              <div style={{overflowY: 'scroll'}}>
                  {getTrips()}
              </div>
            </div>
        </div>
    )
}

export default GetTrips