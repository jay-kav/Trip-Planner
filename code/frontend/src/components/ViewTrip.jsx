import React, { useState, useEffect } from 'react';
import CreateItinerary from './CreateItinerary';
import url from './url';
import GetActivities from './GetActivities';

function ViewTrip(props) {
    let trip = props.trip;
    const [create, setCreate] = useState(false);
    const [users, setUsers] = useState([]);
    const [addMember, setAddMember] = useState(false);
    const [addedMembers, setAddedMembers] = useState([]);
    const [tripOwner, setTripOwner] = useState("");
    const [tripMembers, setTripMembers] = useState([]);
    const [itineraries, setItineraries] = useState([]);

    // Fetch requests
    useEffect(() => {
        if (users.length == 0) {
            fetch(url + "api/users/?is_staff=false")
            .then((response) => response.json())
            .then((data) => {
                if (data.length) {
                    setUsers(data);
                }
            })
            .catch(err => console.log(err))
        }
        if (tripOwner.length == 0) {
            fetch(`${url}api/users/${trip.owner.split("/").slice(-2).slice(0, -1)}/`)
            .then((response) => response.json())
            .then((ownerData) => {
                setTripOwner(ownerData);
            })
            .catch(err => console.log(err))
        }
        if (!itineraries.length) {
            fetch(`${url}api/itineraries/?trip_id=${trip.id}`)
            .then((response) => response.json())
            .then((itinerariesData) => {
                if (itinerariesData.length) {
                    setItineraries(itinerariesData);
                }
            })
            .catch(err => console.log(err))
        }
        
        if (!tripMembers.length) {
            Promise.all(trip.members.map(member =>
                fetch(`${url}api/users/${member.split("/").slice(-2).slice(0, -1)}`)
                    .then(response => response.json())
            ))
            .then(memberData => {
                if (memberData.length) {
                    setTripMembers(memberData);
                }
            })
            .catch(err => console.log(err));
        }
    });

    // Itinerary functions
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
            window.location.reload();
        })
        .catch((err) => console.error("Error:", err));
    }

    const getItineraries = () => {
        return itineraries.map(itinerary => (
            <div key={itinerary.id} className="card" style={{margin: '10px', width: '18rem', minHeight: '20rem'}}>
                <div className="card-body">
                    <div style={{display: 'flex', justifyContent: 'space-between'}} className="card-title">
                        <h5>{itinerary.date}</h5>
                        {localStorage.getItem('sessionID') == tripOwner.id ? <button className="btn btn-danger" onClick={(e) => deleteItinerary(e, itinerary, trip.id)}>Delete</button> : ""}
                    </div>
                    <p className="card-text">{itinerary.start.slice(0, -3)} - {itinerary.end.slice(0, -3)}</p>
                    <br />
                    <GetActivities ids={itinerary.activities} />
                </div>
            </div>
          ));
    }

    // Members Function
    function handle(e) {
        const newData = { ...addedMembers };
        const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
        newData.members = selectedOptions;
        setAddedMembers(newData);
        console.log("newdata", newData);
      }

    const addMembers = (e) => {
      e.preventDefault();
      fetch(`${url}add-members/`, {
          method: 'POST',
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({
                'tripID': trip.id,
                'memberIDs': addedMembers.members
          })
      })
      .then((response) => {
        console.log(response); // Log the entire response
        return response.json();
      })
      .then((responseData) => {
        console.log(responseData);
        window.location.reload();
      })
      .catch((err) => console.error("Error:", err));
    };

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
            window.location.reload();
        })
        .catch((err) => console.error("Error:", err));
    }

    const getTripMembers = () => {
        return tripMembers.map(member => (
            <li className="list-group-item" style={{display: 'flex', justifyContent: 'space-between'}} key={member.id}>
                {member.username}
                {localStorage.getItem('sessionID') == tripOwner.id ? <button className="btn btn-danger" onClick={(e) => removeMember(e, member, trip.id)}>Remove</button> : ""}
            </li>
        ));
    };

    // Trip functions
    const getUsers = () => {
        return users.map(user => (
          <option key={user.id} value={user.id}>{user.username}</option>
        ));
    };

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

    const getTrip = () => {
      return (
        <div>
            <h1 style={{textAlign: 'center'}}>{trip.tripname}</h1>
            <br />
            <br />
            <div key={trip.id} style={{display: 'flex', width: '100%'}}>
                <div style={{width: '50%'}}>
                    <p>Trip Location: {trip.location}</p>
                    <p>Start Date: {trip.startDate}</p>
                    <p>End Date: {trip.endDate}</p>
                </div>
                <ul style={{width: '50%'}} className="list-group">
                    <li className="list-group-item" style={{display: 'flex', justifyContent: 'space-between'}}>
                        <strong>Trip Members</strong>
                        {localStorage.getItem('sessionID') == tripOwner.id && !addMember ? <button onClick={() => setAddMember(!addMember)} className='btn btn-secondary'>Add Member</button> : ""}
                        {addMember && <form className="form-group" onSubmit={(e) => addMembers(e)}>
                            <select className="form-control" onChange={(e) => handle(e)} id="members" multiple> {getUsers()} </select>
                            <br />
                            <div style={{display: 'flex', gap: '10px'}}><button className='btn btn-primary' type='submit'>Add Members</button><button onClick={() => setAddMember(!addMember)} className='btn btn-secondary'>Cancel</button></div>
                        </form>}
                    </li>
                    <li className="list-group-item">{tripOwner.username} (Owner)</li>
                    {getTripMembers()}
                </ul>
            </div>
        </div>
      );
    };

    return (
        <div>
            <button className="btn btn-secondary" onClick={() => window.location.reload()}>Back</button>
            {getTrip()}
            <br />
            <br />
            <h3>Itineraries 
                {localStorage.getItem('sessionID') == tripOwner.id && !create ? <button className='btn btn-secondary' onClick={() => setCreate(!create)}>Add Itinerary</button> 
                : localStorage.getItem('sessionID') == tripOwner.id && create ? <button onClick={() => setCreate(!create)} className='btn btn-secondary'>Cancel</button>
                : ""
                }</h3>
            <div style={{display: 'flex', gap: '20px'}}>
                <div style={{display: 'flex', gap: '20px', overflowX: 'scroll'}}>
                    {getItineraries()}
                </div>
                {create && <CreateItinerary tripID={trip.id} />}
            </div>
            <br />
            <button className='btn btn-danger' onClick={(e) => deleteTrip(e)}>Delete Trip</button>
        </div>
    )
}

export default ViewTrip
