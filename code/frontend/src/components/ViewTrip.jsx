import React, { useState, useEffect } from 'react';
import GetItineraries from './GetItineraries';
import GetTripMembers from './GetTripMembers';
import axios from 'axios';

function ViewTrip(props) {
    let trip = props.trip;
    const [tripOwner, setTripOwner] = useState("");

    // Fetch requests
    useEffect(() => {
        if (tripOwner.length === 0) {
            axios.get(`api/users/${trip.owner.split("/").slice(-2).slice(0, -1)}/`)
            .then((response) => {
                console.log(response);
                setTripOwner(response.data);
            })
            .catch(err => console.log(err))
        }
    });

    // Trip functions
    const deleteTrip = (e) => {
        e.preventDefault();
        axios.post(`delete-trip/`, {
            'tripID': trip.id
        })
        .then((response) => {
          console.log(response);
          window.location.href = "/";
        })
        .catch((err) => console.error("Error:", err));
    }

    const leaveTrip = (e, tripID) => {
        e.preventDefault();
        if (tripOwner.id == localStorage.getItem('sessionID')) {
            alert("You are the owner of this trip. Please assign someone else as trip owner.");
        } else {
            axios.post(`remove-member/`, {
                'memberID': tripOwner.id,
                'tripID': tripID
            })
            .then((response) => {
                console.log(response);
                window.location.reload();
            })
            .catch((err) => console.error("Error:", err));
        }
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
            <button className='btn btn-primary' onClick={() => window.location.reload()}>Home</button>
            <div style={{display: 'grid', gridTemplateColumns: '50% 50%'}}>
                <div key={trip.id}>
                    <h4 style={{textAlign: 'center'}}>{trip.tripname}</h4>
                    <br />
                    {tripInfo()}
                    <br />
                    <GetTripMembers trip={trip} tripOwner={tripOwner} />
                    <br />
                    <div style={{display: 'flex', gap: '20px'}}>
                        <button className='btn btn-danger' onClick={(e) => leaveTrip(e)}>Leave Trip</button>
                        {localStorage.getItem('sessionID') == tripOwner.id && <button className='btn btn-danger' onClick={(e) => deleteTrip(e)}>Delete Trip</button>}
                    </div>
                </div>
                <div>
                    <GetItineraries trip={trip} tripOwner={tripOwner} />
                </div>
            </div>
        </div>
    )
}

export default ViewTrip
