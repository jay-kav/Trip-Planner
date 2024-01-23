import React, { useState, useEffect } from 'react';
import CreateItinerary from './CreateItinerary';
import url from './url';
function ViewTrip() {
    const [trip, setTrip] = useState("");
    const [createItinerary, setCreateItinerary] = useState(True);
  
    const getTrip = () => {
      return (
        <div key={trip.id}>
            <h3>{trip.id} - {trip.tripname}</h3>
            <p>{trip.location}</p>
        </div>
      );
    };  
  
    useEffect(() => {
        fetch(`${url}api/trips/${props.trip}`)
        .then((response) => response.json())
        .then((data) => {
            setTrip(data);
        })
        .catch(err => console.log(err))
    }, []);
  
    return (
        <div>
            {getTrip()}
            {createItinerary ? <CreateItinerary /> : ""}
        </div>
    )
}

export default ViewTrip