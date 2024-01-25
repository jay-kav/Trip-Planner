
import React, { useState, useEffect } from 'react';
import CreateItinerary from './CreateItinerary';
import url from './url';

function ViewTrip(props) {
    let trip = props.trip;
    const [tripOwner, setTripOwner] = useState("");
    const [tripMembers, setTripMembers] = useState([]);
    const [itineraries, setItineraries] = useState([]);

    const deleteItinerary = (itinerary, tripID) => {
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
            <div key={itinerary.id} class="card" style={{width: '18rem', margin: '10px'}}>
            <div class="card-body">
              <h5 class="card-title">{itinerary.id} - {itinerary.date}</h5>
              <p class="card-text">{itinerary.start.slice(0, -3)} - {itinerary.end.slice(0, -3)}</p>
              {localStorage.getItem('sessionID') == tripOwner.id ? <button class="btn btn-secondary" onClick={deleteItinerary(itinerary, trip.id)}>Delete</button> : ""}
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
        //   window.location.href = "/";
        })
        .catch((err) => console.error("Error:", err));
    }


    const getTripMembers = () => {
        return tripMembers.map(member => (
                <li key={member.id}>
                    {member.username} {localStorage.getItem('sessionID') == tripOwner.id ? 
                    <button className="btn btn-secondary" onClick={(e) => removeMember(e, member, trip.id)}>Remove</button> : ""}
                </li>
        ));
    };
    
    const getTrip = () => {
      return (
        <div key={trip.id}>
            <h1>{trip.tripname}</h1>
            <p>Owner: {tripOwner.username}</p>
            <p>Trip Location: {trip.location}</p>
            <p>Start Date: {trip.startDate}</p>
            <p>End Date: {trip.endDate}</p>
            <p>Trip Members:</p>
            <ul>{getTripMembers()}</ul>
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

    return (
        <div>
            <button class="btn btn-secondary" onClick={() => window.location.reload()}>Back</button>
            {getTrip()}
            <div>
                {getItineraries()}
                <CreateItinerary tripID={trip.id} />
            </div>
        </div>
    )
}

export default ViewTrip