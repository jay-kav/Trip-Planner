import React, { useEffect, useState } from 'react';
import url from './url';

function GetActivities (props) {
    const [activities, setActivities] = useState([]);
    if (!activities.length) {
        fetch(`${url}get-activities/`, {
            method: 'POST',
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({
                'activities': props.ids
            })
        })
        .then((response) => {
          console.log(response);
          return response.json();
        })
        .then((responseData) => {
            console.log(responseData);
            setActivities(responseData.activities);
        })
        .catch((err) => console.error("Error:", err));
    }

    return (
        <ul className='list-group'>
            {
            activities.map(activity => (
                <li className='list-group-item' key={activity.id} style={{ display: 'flex'}}>
                    <div>
                        <h5>{activity.name}</h5>
                        <p>{activity.address}</p>
                        <p>{activity.rating}/5</p>
                    </div>
                    <img src={`https://maps.googleapis.com/maps/api/place/photo?parameters=${activity.photos[0].photo_reference}`} style={{marginLeft: '10px', objectFit: 'contain'}} alt={activity.name}/>
                </li>
            ))}
        </ul>
    );
}

export default GetActivities;