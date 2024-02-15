import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { List, ListItem } from '@mui/material';
import { Box, Typography } from '@mui/material';

function GetActivities (props) {
    const [activities, setActivities] = useState([]);
    const [startTimes, setStartTimes] = useState([]);
    const [endTimes, setEndTimes] = useState([]);

    useEffect(() => {
        if (!activities.length) {
            axios.post(`get-activities/`, {
                'activities': props.ids
            })
            .then(res => {
                console.log(res);
                if (res.data.activities.length > 0) {
                    setActivities(res.data.activities);
                    setStartTimes(res.data.startTimes);
                    setEndTimes(res.data.endTimes);
                }
            })
            .catch(err => console.log(err));
        }
    });

    const getItems = () => {
        let items = []
        for (let i = 0; i < activities.length; i++) {
            let activity = activities[i];
            let startTime = startTimes[i];
            let endTime = endTimes[i];
            items.push(<ListItem key={activity.id} sx={{border: 'solid 1px lightgrey', borderRadius: '5px', m: '5px 10px', width: '37vw', justifyContent: 'space-between'}}>
                <Box>
                    <img
                        style={{height: '60px', width: '60px', borderRadius: '30px', objectFit: 'cover', marginRight: '8px'}}
                        src={`data:image/jpeg;base64,${activity.image_data}`}
                        alt={activity.name}
                    />
                </Box>
                <Box sx={{width: '24vw', marginRight: '10px', paddingRight: '10px', borderRight: 'solid 1px lightgrey'}}>
                    <Typography sx={{textWrap: 'wrap'}}>{activity.name}</Typography>
                    <Typography sx={{textWrap: 'wrap'}}>{activity.address}</Typography>
                    <Typography>Rating: {activity.rating}/5</Typography>
                </Box>
                <Box sx={{margin: 'auto', textAlign: 'center' }}>
                    <Typography>{startTime}</Typography>
                    <Typography>{endTime}</Typography>
                </Box>
            </ListItem>);
        }
        return items;
    }

    if (activities.length === 0) {
        return (
            <Typography>No activities found.</Typography>
        );
    }
    return (
        <List>
            {getItems()}
        </List>
    );
}

export default GetActivities;