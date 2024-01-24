import React, { useState, useEffect } from 'react';
import CreateItinerary from './CreateItinerary';
import url from './url';

function ViewTrip(props) {
    let trip = props.trip;
    const [tripOwner, setTripOwner] = useState("");
    const [tripMembers, setTripMembers] = useState([]);
    const [itineraries, setItineraries] = useState([]);
  
    const getItineraries = () => {
        return itineraries.map(itinerary => (
            <div key={itinerary.id}>
                <h3>{itinerary.id}</h3>
            </div>
          ));
    }


    const getTripMembers = () => {
        return tripMembers.map(member => (
                <li key={member.id}>{member.username}</li>
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
            fetch(`${url}api/users/${trip.owner.split("/").pop()}`)
            .then((response) => response.json())
            .then((ownerData) => {
                setTripOwner(ownerData.pop());
            })
            .catch(err => console.log(err))
        }
        if (itineraries == "") {
            fetch(`${url}api/itineraries/`)
            .then((response) => response.json())
            .then((itineraryData) => {
                setItineraries(itineraryData);
            })
            .catch(err => console.log(err))
        }
        if (tripMembers == "") {
            Promise.all(trip.members.map(member =>
                fetch(`${url}api/users/${member.split("/").pop()}`)
                    .then(response => response.json())
            ))
            .then(memberData => {
                setTripMembers(memberData.pop());
            })
            .catch(err => console.log(err));
        }
        });

    return (
        <div>
            {getTrip()}
            <div>
                {getItineraries()}
                <CreateItinerary tripID={trip.id} />
            </div>
        </div>
    )
}

export default ViewTrip