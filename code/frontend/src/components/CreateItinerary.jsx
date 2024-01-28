import React, { useState } from 'react'
import url from './url';
import axios from 'axios';

function CreateItinerary(props) {
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
      axios.post(`create-itinerary/`, {
        'tripID': props.tripID,
        'date': data.date,
        'startTime': data.startTime,
        'endTime': data.endTime
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
        <div style={{minHeight: '20rem', borderLeft: 'solid 1px grey', paddingLeft: '30px'}}>
            <form className="form-group" onSubmit={(e) => submitForm(e)}>
                <label htmlFor="date">Date </label>
                <input className="form-control" onChange={(e) => handle(e)} value={data.date} id="date" type='date'></input>
                <br />
                <label htmlFor="startTime">Start Time </label>
                <input className="form-control" onChange={(e) => handle(e)} value={data.startTime} id="startTime" type='time'></input>
                <br />
                <label htmlFor="endTime">End Time </label>
                <input className="form-control" onChange={(e) => handle(e)} value={data.endTime} id="endTime" type='time'></input>
                <br />
                <button className="btn btn-primary" type='submit'>Create Itinerary</button>
            </form>
        </div>
    )
}

export default CreateItinerary
