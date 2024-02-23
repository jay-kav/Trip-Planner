import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, List, ListItem } from '@mui/material';
import { Box, Typography } from '@mui/material';

function GetActivities (props) {
    const [activities, setActivities] = useState([]);
    
    // Fetch request to get activities
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

    // Function to map activities to components
    const getItems = () => {
        return activities.map(activity => (
            <ListItem key={activity.id} sx={{border: 'solid 1px lightgrey', borderRadius: '5px', m: '5px 10px', width: '37vw', justifyContent: 'space-between'}}>
                <Box sx={{textAlign: 'center', width: '3vw'}}>
                    <Typography>{activity.startTimes}</Typography>
                    <Typography>{activity.endTimes}</Typography>
                </Box>
                <Box sx={{width: '24vw', marginLeft: '10px', paddingLeft: '10px', borderLeft: 'solid 1px lightgrey'}}>
                    <Typography sx={{textWrap: 'wrap'}}>{activity.name}</Typography>
                    <Typography sx={{textWrap: 'wrap'}}>{activity.address}</Typography>
                    <Box sx={{display: 'flex', gap: '10px'}}>
                        {activity.website  && (<Button sx={{fontSize: '.8vw'}} variant="contained" href={activity.website} target="_blank" rel="noopener noreferrer">Website</Button> )}
                        {activity.url && (<Button sx={{fontSize: '.8vw'}} variant="contained" href={activity.url} target="_blank" rel="noopener noreferrer">Location</Button>)}
                    </Box>
                </Box>
                <Box sx={{justifyContent: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column', width: '5vw'}}>
                    <img
                        style={{height: '60px', width: '60px', borderRadius: '30px', objectFit: 'cover'}}
                        src={`data:image/jpeg;base64,${activity.image_data}`}
                        alt={activity.name}
                    />
                    <Typography sx={{textWrap: 'wrap', textAlign: 'center'}}>{activity.type}</Typography>
                </Box>
            </ListItem>
        ));
    }

    // default behaviour if no activities were retrieved
    if (activities.length == 0) {
        return (
            <Typography>No activities found.</Typography>
        );
    }
    // return list of activities
    return (
        <List>
            {getItems()}
        </List>
    );
}

export default GetActivities;