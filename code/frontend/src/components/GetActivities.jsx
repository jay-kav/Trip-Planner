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
                <li className='list-group-item' key={activity.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px', alignItems: 'center'}}>
                    <div style={{alignItems: 'center', padding: '0 4px'}}>
                        <h5 style={{fontSize: '14px'}}>{activity.name}</h5>
                        <p style={{fontSize: '12px'}}>{activity.address}</p>
                        <p style={{fontSize: '11px', margin: 0}}>Rating: {activity.rating}/5</p>
                    </div>
                    <div style={{alignItems: 'center'}}>
                        <img
                            style={{height: '60px', width: '60px', borderRadius: '30px', objectFit: 'cover', margin: '0 8px'}}
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