import React, { useState, useEffect } from 'react'
import url from './url';

function CreateTrip() {
    const [users, setUsers] = useState([]);
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [data, setData] = useState({
      tripname: "",
      location: "",
      startDate: "",
      endDate: "",
      members: ""
    });

    const getUsers = () => {
      return users.map(user => (
        <option key={user.id} value={user.id}>{user.username}</option>
      ));
    };  

    useEffect(() => {
      if (users.length === 0) {
          fetch(url + "api/users/?is_staff=false")
          .then((response) => response.json())
          .then((data) => {
              setUsers(data);
          })
          .catch(err => console.log(err))
      }
    });
  
    function handle (e) {
      const newData = {...data};
      newData[e.target.id] = e.target.value;
      setData(newData);
      console.log(newData);
    }

    function handleMemberSelection(e) {
      const userID = parseInt(e.target.value, 10);
      setSelectedMembers(prevMembers => [...prevMembers, userID]);
    }
  
    function submitForm (e) {
      e.preventDefault();
      console.log({
        'ownerID': localStorage.getItem('sessionID'),
        'tripname': data.tripname,
        'location': data.location,
        'startDate': data.startDate,
        'endDate': data.endDate,
        'members': selectedMembers
    });
      fetch(`${url}create-trip/`, {
          method: 'POST',
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({
              'ownerID': localStorage.getItem('sessionID'),
              'tripname': data.tripname,
              'location': data.location,
              'startDate': data.startDate,
              'endDate': data.endDate,
              'members': selectedMembers
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
    };
  
    return (
      <div>
        <h1>New Trip</h1>
        <form onSubmit={(e) => submitForm(e)}>
          <label htmlFor="tripname">Trip Name </label>
          <input onChange={(e) => handle(e)} value={data.tripname} id="tripname" type='text'></input>
          <br />
          <label htmlFor="location">Location </label>
          <input onChange={(e) => handle(e)} value={data.location} id="location" type='text'></input>
          <br />
          <label htmlFor="startDate">Start Date </label>
          <input onChange={(e) => handle(e)} value={data.startDate} id="startDate" type='date'></input>
          <br />
          <label htmlFor="endDate">End Date </label>
          <input onChange={(e) => handle(e)} value={data.endDate} id="endDate" type='date'></input>
          <br />
          <label htmlFor="members">Members </label>
          <select onChange={(e) => handle(e)} multiple id="members">
            {getUsers()}
          </select>
          <br />
          <button type='submit'>Create Trip</button>
        </form>
      </div>
    );
}

export default CreateTrip