import axios from 'axios';
import React, { useState, useEffect } from 'react';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import AddModeratorIcon from '@mui/icons-material/AddModerator';

function GetTripMembers(props) {
    let tripOwner = props.tripOwner;
    let trip = props.trip;
    let nonMembers;
    
    const [addMember, setAddMember] = useState(false);
    const [addedMembers, setAddedMembers] = useState([]);
    const [tripMembers, setTripMembers] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        if (!tripMembers.length) {
            Promise.all(trip.members.map(member =>
                axios.get(`api/users/${member.split("/").slice(-2).slice(0, -1)}`)
            ))
            .then(response => {
                console.log(response);
                setTripMembers(response);
            })
            .catch(err => console.log(err));
        }
        if (!users.length) {
            axios.get("api/users/?is_staff=false")
            .then((response) => {
                if (response.data.length) {
                    setUsers(response.data);
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

    const getNonMembers = () => {
        nonMembers = users.filter(user => (user.id != localStorage.getItem('sessionID') && !trip.members.includes(user.url)));
        if (nonMembers.length === 0) {
            return <option>No users to add</option>
        }
        return <select className="form-control" onChange={(e) => handle(e)} id="members" multiple>
            {nonMembers.map(user => (
            <option key={user.id} value={user.id}>{user.username}</option>
        ))}
        </select>
    };

    const addMembers = (e) => {
      e.preventDefault();
        if (addedMembers.length === 0) {
            alert("Please select members to add.");
        } else {
            axios.post(`add-members/`, {
                'tripID': trip.id,
                'memberIDs': addedMembers
            })
            .then((response) => {
              console.log(response);
              window.location.reload();
            })
            .catch((err) => console.error("Error:", err));
        }
    };

    const removeMember = (e, member, tripID) => {
        e.preventDefault();
        axios.post(`remove-member/`, {
            'memberID': member.id,
            'tripID': tripID
        })
        .then((response) => {
            console.log(response);
            window.location.reload();
        })
        .catch((err) => console.error("Error:", err));
    }

    const changeOwner = (e, member, tripID) => {
        e.preventDefault();
        axios.post(`change-owner/`, {
            'memberID': member.id,
            'tripID': tripID
        })
        .then((response) => {
            console.log(response);
            window.location.reload();
        })
        .catch((err) => console.error("Error:", err));
    }

    const getTripMembers = () => {
        return tripMembers.map(member => (
            member.data.id != tripOwner.id &&
            <li className="list-group-item" style={{alignItems: 'center', display: 'flex', justifyContent: 'space-between', fontSize: '14px'}} key={member.data.id}>
                {member.data.username}
                <div style={{display: 'flex', gap: '10px'}}>
                    {localStorage.getItem('sessionID') == tripOwner.id && <AddModeratorIcon titleAccess="Make Trip Owner" onClick={(e) => changeOwner(e, member.data, trip.id)} />}
                    {localStorage.getItem('sessionID') == tripOwner.id && <HighlightOffIcon titleAccess="Remove Member" onClick={(e) => removeMember(e, member, trip.id)} />}
                </div>
            </li>
        ));
    };

    return (
      <ul className="list-group" style={{height: '45%'}}>
          <li className="list-group-item" style={{display: 'flex', justifyContent: 'space-between'}}>
              <strong>Trip Members</strong>
              {localStorage.getItem('sessionID') == tripOwner.id && !addMember && <GroupAddIcon titleAccess="Add Member" onClick={() => setAddMember(!addMember)}/>}
              {addMember && <form className="form-group" onSubmit={(e) => addMembers(e)}>
                  {getNonMembers()}
                  <br />
                  <div style={{display: 'flex', gap: '10px'}}>{nonMembers.length > 0 && <button className='btn btn-primary' type='submit'>Add Members</button>}<button onClick={() => setAddMember(!addMember)} className='btn btn-secondary'>Cancel</button></div>
              </form>}
          </li>
          <li className="list-group-item" style={{alignItems: 'center', fontSize: '14px'}}>{tripOwner.username} (Owner)</li>
          {getTripMembers()}
      </ul>
    )
}

export default GetTripMembers