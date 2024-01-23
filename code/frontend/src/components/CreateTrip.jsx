import React, { useState, useEffect } from 'react'

function CreateTrip() {
    const url = "http://127.0.0.1:8000/";
    const [users, setUsers] = useState([]);
    const [data, setData] = useState({
      tripname: "",
      location: "",
      startDate: "",
      endDate: ""
    });

    const getUsers = () => {
      return users.map(user => (
        <option key={user.id}>{user.username}</option>
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
  
    function submitForm (e) {
      e.preventDefault();
      fetch(`${url}create-trip/`, {
          method: 'POST',
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({
              'ownerID': localStorage.getItem('sessionID'),
              'tripname': data.tripname,
              'location': data.location,
              'startDate': data.startDate,
              'endDate': data.endDate
          })
      })
      .then((response) => {
        console.log(response); // Log the entire response
        return response.json();
      })
      .then((responseData) => {
        console.log(responseData);
      })
      .catch((err) => console.error("Error:", err));
    };
  
    return (
      <div>
        <h1>New Trip</h1>
        <form onSubmit={(e) => submitForm(e)}>
          <label for="tripname">Trip Name </label>
          <input onChange={(e) => handle(e)} value={data.tripname} id="tripname" type='text'></input>
          <br />
          <label for="location">Location </label>
          <input onChange={(e) => handle(e)} value={data.location} id="location" type='text'></input>
          <br />
          <label for="startDate">Start Date </label>
          <input onChange={(e) => handle(e)} value={data.startDate} id="startDate" type='date'></input>
          <br />
          <label for="endDate">End Date </label>
          <input onChange={(e) => handle(e)} value={data.endDate} id="endDate" type='date'></input>
          <br />
          <label for="members">Members </label>
          <select id="members">
            {getUsers()}
          </select>
          <br />
          <button type='submit'>Create Trip</button>
        </form>
      </div>
    );
}

export default CreateTrip