import React, { useState, useEffect } from 'react';
import CreateItinerary from './CreateItinerary';
import url from './url';

function ViewTrip(props) {
    let tripID = props.trip;
    const [trip, setTrip] = useState("");
    const [itineraries, setItineraries] = useState([]);
  
    const getTrip = () => {
      return (
        <div key={trip.id}>
            <h1>{trip.tripname}</h1>
            <p>Trip Location: {trip.location}</p>
            <p>Start Date: {trip.startDate}</p>
            <p>End Date: {trip.endDate}</p>
        </div>
      );
    };

    const getItineraries = () => {
        return itineraries.map(itinerary => (
            <div key={itinerary.id}>
                <h3>{itinerary.id}</h3>
            </div>
          ));
    }
  
    useEffect(() => {
        if (trip == []) {
            fetch(`${url}api/trips/${tripID}`)
            .then((response) => response.json())
            .then((data) => {
                setTrip(data);
            })
            .catch(err => console.log(err))
        }
        if (itineraries == "") {
            fetch(`${url}api/itineraries/`)
            .then((response) => response.json())
            .then((data) => {
                setItineraries(data);
            })
            .catch(err => console.log(err))
        }
        });

    return (
        <div>
            {getTrip()}
            <div>
                {getItineraries()}
                <CreateItinerary />
            </div>
        </div>
    )
}

export default ViewTrip