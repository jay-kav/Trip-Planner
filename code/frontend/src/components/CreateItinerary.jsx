import React, { useState } from 'react'

function CreateItinerary() {
    const url = "http://127.0.0.1:8000/";
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
                <label>Date </label>
                <input onChange={(e) => handle(e)} value={data.date} id="date" type='date'></input>
                <br />
                <label>Start Time </label>
                <input onChange={(e) => handle(e)} value={data.startTime} id="startTime" type='time'></input>
                <br />
                <label>End Time </label>
                <input onChange={(e) => handle(e)} value={data.endTime} id="endTime" type='time'></input>
                <br />
                <button type='submit'>Create Itinerary</button>
            </form>
        </div>
    )
}

export default CreateItinerary