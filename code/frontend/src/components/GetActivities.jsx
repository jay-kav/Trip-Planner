import React, { useEffect, useState } from 'react';
import axios from 'axios';

function GetActivities (props) {
    const [activities, setActivities] = useState([]);

    useEffect(() => {
        if (!activities.length) {
            axios.post(`get-activities/`, {
                'activities': props.ids
            })
            .then(res => {
                console.log(res.data);
                if (res.data.activities.length) {
                    setActivities(res.data.activities);
                }
            })
            .catch(err => console.log(err));
        }
    });

    return (
        <ul className='list-group'>
            {
            activities.map(activity => (
                <li className='list-group-item' key={activity.id} style={{ display: 'flex', justifyContent: 'space-between'}}>
                    <div>
                        <h5>{activity.name}</h5>
                        <p>{activity.address}</p>
                        <p>{activity.rating}/5</p>
                    </div>
                    <div>
                        <img
                            style={{height: '160px', width: '160px', borderRadius: '80px', objectFit: 'cover', marginLeft: '20px'}}
                            src={`data:image/jpeg;base64,${activity.image_data}`}
                            alt={activity.name}
                        />
                    </div>
                </li>
            ))}
        </ul>
    );
}

export default GetActivities;