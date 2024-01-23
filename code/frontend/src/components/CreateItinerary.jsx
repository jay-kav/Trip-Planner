import React, { useState } from 'react'
import url from './url';

function CreateItinerary() {
    const [data, setData] = useState({
      date: "",
      startTime: "",
      endTime: ""
    });
  
    function handle (e) {
      const newData = {...data};
      newData[e.target.id] = e.target.value;
      setData(newData);
      console.log(newData);
    }
  
    function submitForm (e) {
      e.preventDefault();
      fetch(`${url}create-itinerary/`, {
          method: 'POST',
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({
              'date': data.date,
              'startTime': data.startTime,
              'endTime': data.endTime
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
            <h1>Add Itinerary</h1>
            <form onSubmit={(e) => submitForm(e)}>
                <label htmlFor="date">Date </label>
                <input onChange={(e) => handle(e)} value={data.date} id="date" type='date'></input>
                <br />
                <label htmlFor="startTime">Start Time </label>
                <input onChange={(e) => handle(e)} value={data.startTime} id="startTime" type='time'></input>
                <br />
                <label htmlFor="endTime">End Time </label>
                <input onChange={(e) => handle(e)} value={data.endTime} id="endTime" type='time'></input>
                <br />
                <button type='submit'>Create Itinerary</button>
            </form>
        </div>
    )
}

export default CreateItinerary