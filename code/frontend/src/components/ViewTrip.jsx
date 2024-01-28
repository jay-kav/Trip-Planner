import React, { useState, useEffect } from 'react';
import url from './url';
import GetItineraries from './GetItineraries';
import GetTripMembers from './GetTripMembers';

function ViewTrip(props) {
    let trip = props.trip;
    const [tripOwner, setTripOwner] = useState("");

    // Fetch requests
    useEffect(() => {
        if (tripOwner.length == 0) {
            fetch(`${url}api/users/${trip.owner.split("/").slice(-2).slice(0, -1)}/`)
            .then((response) => response.json())
            .then((ownerData) => {
                setTripOwner(ownerData);
            })
            .catch(err => console.log(err))
        }
    });

    // Trip functions
    const deleteTrip = (e) => {
        e.preventDefault();
        fetch(`${url}delete-trip/`, {
            method: 'POST',
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({
                'tripID': trip.id
            })
        })
        .then((response) => {
          console.log(response); // Log the entire response
          return response.json();
        })
        .then((responseData) => {
          console.log(responseData);
          window.location.href = "/";
        })
        .catch((err) => console.error("Error:", err));
    }

    const tripInfo = () => {
      return (
        <div>
            <p>Trip Location: {trip.location}</p>
            <p>Start Date: {trip.startDate}</p>
            <p>End Date: {trip.endDate}</p>
        </div>
      );
    };

    return (
        <div>
            <button className="btn btn-secondary" onClick={() => window.location.reload()}>Back</button>
            <h1 style={{textAlign: 'center'}}>{trip.tripname}</h1>
            <br />
            <div key={trip.id} style={{display: 'flex', width: '100%', justifyContent: 'space-between'}}>
                {tripInfo()}
                <GetTripMembers trip={trip} tripOwner={tripOwner} />
            </div>
            <br />
            <GetItineraries trip={trip} tripOwner={tripOwner} />
            <br />
            {localStorage.getItem('sessionID') == tripOwner.id && <button className='btn btn-danger' onClick={(e) => deleteTrip(e)}>Delete Trip</button>}
        </div>
    )
}

export default ViewTrip
