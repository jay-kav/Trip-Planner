import React, { useState, useEffect } from 'react';
import url from './url';

function GetTripMembers(props) {
    let tripOwner = props.tripOwner;
    let trip = props.trip;
    
    const [addMember, setAddMember] = useState(false);
    const [addedMembers, setAddedMembers] = useState([]);
    const [tripMembers, setTripMembers] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
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
    });
    
    // Members Function
    const handle = (e) => {
        const newData = { ...addedMembers };
        const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
        newData.members = selectedOptions;
        setAddedMembers(newData.members);
        console.log("newdata", newData);
    }

    const getUsers = () => {
        let notOwner = users.filter(user => (user.id != localStorage.getItem('sessionID') && !trip.members.includes(user.url)));
        if (notOwner.length == 0) {
            return <option>No users to add</option>
        }
        return <select className="form-control" onChange={(e) => handle(e)} id="members" multiple>
            {notOwner.map(user => (
            <option key={user.id} value={user.id}>{user.username}</option>
        ))}
        </select>
    };

    const addMembers = (e) => {
      e.preventDefault();
        if (addedMembers.length == 0) {
            alert("Please select members to add.");
        } else {
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
        }
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

    return (
      <ul style={{width: '50%'}} className="list-group">
          <li className="list-group-item" style={{display: 'flex', justifyContent: 'space-between'}}>
              <strong>Trip Members</strong>
              {localStorage.getItem('sessionID') == tripOwner.id && !addMember ? <button onClick={() => setAddMember(!addMember)} className='btn btn-secondary'>Add Member</button> : ""}
              {addMember && <form className="form-group" onSubmit={(e) => addMembers(e)}>
                  {getUsers()}
                  <br />
                  <div style={{display: 'flex', gap: '10px'}}><button className='btn btn-primary' type='submit'>Add Members</button><button onClick={() => setAddMember(!addMember)} className='btn btn-secondary'>Cancel</button></div>
              </form>}
          </li>
          <li className="list-group-item">{tripOwner.username} (Owner)</li>
          {getTripMembers()}
      </ul>
    )
}

export default GetTripMembers