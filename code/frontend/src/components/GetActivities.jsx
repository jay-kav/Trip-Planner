import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { List, ListItem } from '@mui/material';
import { Box, Typography } from '@mui/material';

function GetActivities (props) {
    const [activities, setActivities] = useState([]);

    useEffect(() => {
        if (!activities.length) {
            axios.post(`get-activities/`, {
                'activities': props.ids,
                'country': props.country,
                'city': props.city,
            })
            .then(res => {
                console.log(res);
                if (res.data.activities.length > 0) {
                    setActivities(res.data.activities);
                }
            })
            .catch(err => console.log(err));
        }
    });

    const getItems = () => {
        return activities.map(activity => (
            <ListItem key={activity.id} sx={{border: 'solid 1px lightgrey', borderRadius: '5px', m: '5px 10px', width: '37vw', justifyContent: 'space-between'}}>
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
                    {activity.website && (
                    <Typography>
                        <a href={activity.website} target="_blank" rel="noopener noreferrer">Website</a>
                    </Typography>
                    )}
                    {activity.url && (
                    <Typography>
                        <a href={activity.url} target="_blank" rel="noopener noreferrer">Location</a>
                    </Typography>
                    )}

                </Box>
                <Box sx={{margin: 'auto', textAlign: 'center' }}>
                    <Typography>{activity.startTimes}</Typography>
                    <Typography>{activity.endTimes}</Typography>
                </Box>
            </ListItem>
        ));
    }

    if (activities.length == 0) {
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