import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CreateTrip() {
    const [users, setUsers] = useState([]);
    const [data, setData] = useState({
      tripname: "",
      location: "",
      startDate: "",
      endDate: "",
      members: []
    });

    const getUsers = () => {
      let notOwner = users.filter(user => user.id != localStorage.getItem('sessionID'));
      return notOwner.map(user => (
        <option key={user.id} value={user.id}>{user.username}</option>
      ));
    };  

    useEffect(() => {
      if (users.length === 0) {
          axios.get("api/users/?is_staff=false")
          .then((response) => response.json())
          .then((data) => {
              setUsers(data);
          })
          .catch(err => console.log(err))
      }
    });
  
    function handle(e) {
      const newData = { ...data };
    
      if (e.target.id === "members") {
        // If the event target is the "members" select element
        const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
        newData.members = selectedOptions;
      } else {
        // For other input fields
        newData[e.target.id] = e.target.value;
      }
      setData(newData);
      console.log("newdata", newData);
    }
    
    const getDate = (date) => {
      let num = date.split("-");
      return parseInt(num[0]) + parseInt(num[1]) * 30 + parseInt(num[2]) * 365;
    }
  
    function submitForm (e) {
      e.preventDefault();
      if (data.tripname === "") {
        alert("Please enter a trip name");
      } else if (data.location === "") {
        alert("Please enter a location");
      } else if (data.startDate === "") {
        alert("Please enter a start date");
      } else if (data.endDate === "") {
        alert("Please enter an end date");
      } else if (getDate(data.startDate) > getDate(data.endDate)) {
        alert("End date must be after start date");
      } else {
        axios.post(`create-trip/`, {
          'ownerID': localStorage.getItem('sessionID'),
          'tripname': data.tripname,
          'location': data.location,
          'startDate': data.startDate,
          'endDate': data.endDate,
          'members': data.members.push(localStorage.getItem('sessionID'))
        })
        .then((response) => {
          console.log(response); // Log the entire response
          return response.json();
        })
        .then((responseData) => {
          console.log(responseData);
          //window.location.href = "/";
        })
        .catch((err) => console.error("Error:", err));
      }
    };
  
    return (
      <div>
        <button className="btn btn-secondary" onClick={() => window.location.href='/'}>Back</button>
        <h1>New Trip</h1>
        <form className="form-group" onSubmit={(e) => submitForm(e)}>
          <label htmlFor="tripname">Trip Name </label>
          <input className="form-control" onChange={(e) => handle(e)} value={data.tripname} id="tripname" type='text'></input>
          <br />
          <label htmlFor="location">Location </label>
          <input className="form-control" onChange={(e) => handle(e)} value={data.location} id="location" type='text'></input>
          <br />
          <label htmlFor="startDate">Start Date </label>
          <input className="form-control" onChange={(e) => handle(e)} value={data.startDate} id="startDate" type='date'></input>
          <br />
          <label htmlFor="endDate">End Date </label>
          <input className="form-control" onChange={(e) => handle(e)} value={data.endDate} id="endDate" type='date'></input>
          <br />
          <label htmlFor="members">Members </label>
          <select className="form-control" onChange={(e) => handle(e)} id="members" multiple>
            {getUsers()}
          </select>
          <br />
          <button className="btn btn-secondary" type='submit'>Create Trip</button>
        </form>
      </div>
    );
}

export default CreateTrip