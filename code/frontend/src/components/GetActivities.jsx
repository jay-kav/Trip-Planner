import React, { useEffect, useState } from 'react';
import url from './url';

function GetActivities (props) {
    const [activities, setActivities] = useState([]);

    console.log(props.ids);

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

    console.log('activities', activities);
    return (
        <ul className='list-group'>
            {
            activities.map(activity => (
                <li className='list-group-item' key={activity.id}>
                    <h5>{activity.name} - {activity.rating}</h5>
                    <p>{activity.address}</p>
                    <img src={`https://maps.googleapis.com/maps/api/place/photo?parameters=${activity.photos[0].photo_reference}`} alt={activity.name}/>
                </li>
            ))}
        </ul>
    );
}

export default GetActivities;