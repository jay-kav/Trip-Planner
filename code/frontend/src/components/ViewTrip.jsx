import React, { useState, useEffect } from 'react';
import CreateItinerary from './CreateItinerary';
import url from './url';

function ViewTrip(props) {
    let trip = props.trip;
    const [create, setCreate] = useState(false);
    const [tripOwner, setTripOwner] = useState("");
    const [tripMembers, setTripMembers] = useState([]);
    const [itineraries, setItineraries] = useState([]);

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
          window.location.href = "/";
        })
        .catch((err) => console.error("Error:", err));
    }

    const getItineraries = () => {
        return itineraries.map(itinerary => (
            <div key={itinerary.id} className="card" style={{margin: '10px', minHeight: '30rem'}}>
                <div className="card-body">
                    <div style={{display: 'flex', justifyContent: 'space-between'}} className="card-title">
                        <h5>{itinerary.date}</h5>
                        {localStorage.getItem('sessionID') == tripOwner.id ? <button className="btn btn-secondary" onClick={(e) => deleteItinerary(e, itinerary, trip.id)}>Delete</button> : ""}
                    </div>
                    <p className="card-text">{itinerary.start.slice(0, -3)} - {itinerary.end.slice(0, -3)}</p>
                </div>
            </div>
          ));
    }

    const removeMember = (e, member, tripID) => {
        e.preventDefault();
        fetch(`${url}remove-member/`, {
            method: 'POST',
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({
                'memberID': member.id,
                'tripID': tripID
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

    const getTripMembers = () => {
        return tripMembers.map(member => (
            <li className="list-group-item" style={{display: 'flex', justifyContent: 'space-between'}} key={member.id}>
                {member.username}
                {localStorage.getItem('sessionID') == tripOwner.id ? <button className="btn btn-secondary" onClick={(e) => removeMember(e, member, trip.id)}>Remove</button> : ""}
            </li>
        ));
    };
    
    const getTrip = () => {
      return (
        <div>
            <h1 style={{textAlign: 'center'}}>{trip.tripname}</h1>
            <br />
            <div key={trip.id} style={{display: 'flex', width: '100%'}}>
                <div style={{width: '50%'}}>
                    <p>Owner: {tripOwner.username}</p>
                    <p>Trip Location: {trip.location}</p>
                    <p>Start Date: {trip.startDate}</p>
                    <p>End Date: {trip.endDate}</p>
                </div>
                <ul style={{width: '50%'}} className="list-group">
                    <li className="list-group-item" style={{display: 'flex', justifyContent: 'space-between'}}><strong>Trip Members</strong> <button className='btn btn-secondary'>Add Member</button></li>
                    {getTripMembers()}
                </ul>
            </div>
        </div>
      );
    };
  
    useEffect(() => {
        if (tripOwner.length === 0) {
            fetch(`${url}api/users/${trip.owner.split("/").slice(-2).slice(0, -1)}/`)
            .then((response) => response.json())
            .then((ownerData) => {
                setTripOwner(ownerData);
            })
            .catch(err => console.log(err))
        }
        if (itineraries == "") {
            fetch(`${url}api/itineraries/?trip_id='${url}${trip.id}/'`)
            .then((response) => response.json())
            .then((itinerariesData) => {
                setItineraries(itinerariesData);
            })
            .catch(err => console.log(err))
        }
        if (tripMembers == "") {
            Promise.all(trip.members.map(member =>
                fetch(`${url}api/users/${member.split("/").slice(-2).slice(0, -1)}`)
                    .then(response => response.json())
            ))
            .then(memberData => {
                setTripMembers(memberData);
            })
            .catch(err => console.log(err));
        }
    });
    
    const newItinerary = (e) => {
        e.preventDefault();
        setCreate(!create);
    }

    return (
        <div>
            <button className="btn btn-secondary" onClick={() => window.location.reload()}>Back</button>
            {getTrip()}
            <br />
            <h3>Itineraries {!create ? <button className='btn btn-primary' onClick={(e) => newItinerary(e)}>Add Itinerary</button> : <button onClick={(e) => newItinerary(e)} className='btn btn-secondary'>Cancel</button>}</h3>
            <div style={{display: 'flex', width: '100%'}}>
                {getItineraries()}
                {create ? <CreateItinerary tripID={trip.id} /> : ""}
            </div>
        </div>
    )
}

export default ViewTrip