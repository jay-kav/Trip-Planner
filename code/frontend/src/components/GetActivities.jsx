import React, { useEffect, useState } from 'react';
import axios from 'axios';

function GetActivities (props) {
    const [activities, setActivities] = useState([]);

    useEffect(() => {
        axios.post(`get-activities/`, {
            'activities': props.ids
        })
        .then(res => {
            console.log(res.data);
            setActivities(res.data.activities);
        })
        .catch(err => console.log(err));
    }, []);

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
                    <img
                        style={{height: '160px', width: '160px', objectFit: 'cover', marginLeft: '20px'}}
                        //src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=${activity.photos[0].width}&photo_reference=${activity.photos[0].photo_reference}&key=AIzaSyAudMNmJ-wUGoZKtx61S3mh6GhvzBMCbHM`}
                        alt={activity.name}/>
                </li>
            ))}
        </ul>
    );
}

export default GetActivities;