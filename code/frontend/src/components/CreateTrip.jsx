import React, { useState } from 'react'

function CreateTrip() {
    const url = "http://127.0.0.1:8000/";
    const [data, setData] = useState({
      tripname: "",
      location: "",
      startDate: "",
      endDate: ""
    });
  
    function handle (e) {
      const newData = {...data};
      newData[e.target.id] = e.target.value;
      setData(newData);
      console.log(newData);
    }
  
    function submitForm (e) {
      e.preventDefault();
      fetch(`${url}createtrip/`, {
          method: 'POST',
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({
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
          <label>Trip Name </label>
          <input onChange={(e) => handle(e)} value={data.tripname} id="tripname" type='text'></input>
          <br />
          <label>Location </label>
          <input onChange={(e) => handle(e)} value={data.location} id="location" type='text'></input>
          <br />
          <label>Start Date </label>
          <input onChange={(e) => handle(e)} value={data.startDate} id="startDate" type='date'></input>
          <br />
          <label>End Date </label>
          <input onChange={(e) => handle(e)} value={data.endDate} id="endDate" type='date'></input>
          <br />
          <button type='submit'>Create Trip</button>
        </form>
      </div>
    );
}

export default CreateTrip