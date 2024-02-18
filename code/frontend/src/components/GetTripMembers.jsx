import axios from 'axios';
import React, { useState, useEffect } from 'react';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import AddModeratorIcon from '@mui/icons-material/AddModerator';
import { Button, List, ListItemIcon, ListItemText, MenuItem, Typography } from '@mui/material';
import ListItem from '@mui/material/ListItem';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Box, CssBaseline, Grid } from '@mui/material';
import Select from '@mui/material/Select';
import { Card, CardContent } from '@mui/material';

const defaultTheme = createTheme();

function GetTripMembers(props) {
    let tripOwner = props.tripOwner;
    let trip = props.trip;
    let nonMembers;
    
    const [addMember, setAddMember] = useState(false);
    const [addedMembers, setAddedMembers] = useState([]);
    const [tripMembers, setTripMembers] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        if (!tripMembers.length) {
            Promise.all(trip.members.map(member =>
                axios.get(`api/users/${member.split("/").slice(-2).slice(0, -1)}`)
            ))
            .then(response => {
                console.log(response);
                setTripMembers(response);
            })
            .catch(err => console.log(err));
        }
        if (!users.length) {
            axios.get("api/users/?is_staff=false")
            .then((response) => {
                if (response.data.length) {
                    setUsers(response.data);
                }
            })
            .catch(err => console.log(err))
        }
    });

    const getNonMembers = () => {
        nonMembers = users.filter(user => (user.id != localStorage.getItem('sessionID') && !trip.members.includes(user.url)));
        console.log("nonMembers", nonMembers);
        if (nonMembers.length === 0) {
            return <Typography key="" value="">No users to add</Typography>
        }
        return <Select
            required
            fullWidth
            id="members"
            label="Members"
            name="members"
            multiple
            defaultValue={''} // Provide the default value
            value={addedMembers} // Provide the array of selected members
            onChange={(e) => setAddedMembers(e.target.value)} // Update the state with selected members
            sx={{ width: '10vw' }}
        >
            <MenuItem key={"default"} value={''}></MenuItem>
            {nonMembers.map(user => (
                <MenuItem key={user.id} value={user.id}>{user.username}</MenuItem>
            ))}
        </Select>
    };

    const addMembers = (e) => {
        e.preventDefault();
        console.log("addedMembers", addedMembers);
        if (addedMembers.length === 0) {
            alert("Please select members to add.");
        } else {
            axios.post(`add-members/`, {
                'tripID': trip.id,
                'memberIDs': addedMembers
            })
            .then((response) => {
              console.log(response);
              window.location.href = "/";
            })
            .catch((err) => console.error("Error:", err));
        }
    };

    const removeMember = (e, member, tripID) => {
        e.preventDefault();
        axios.post(`remove-member/`, {
            'memberID': member.data.id,
            'tripID': tripID
        })
        .then((response) => {
            console.log(response);
            window.location.reload();
        })
        .catch((err) => console.error("Error:", err));
    }

    const changeOwner = (e, member, tripID) => {
        e.preventDefault();
        console.log(member, tripID);
        axios.post(`change-owner/`, {
            'memberID': member.id,
            'tripID': tripID
        })
        .then((response) => {
            console.log(response);
            window.location.reload();
        })
        .catch((err) => console.error("Error:", err));
    }

    const getTripMembers = () => {
        return tripMembers.map(member => (
            tripOwner.id != member.data.id && <ListItem key={member.data.id} disablePadding>
                <ListItemText primary={member.data.username} />
                <ListItemIcon sx={{marginLeft: '5rem'}}>
                    <div style={{display: 'flex', gap: '10px'}}>
                        {localStorage.getItem('sessionID') == tripOwner.id && <AddModeratorIcon titleAccess="Make Trip Owner" onClick={(e) => changeOwner(e, member.data, trip.id)} />}
                        {localStorage.getItem('sessionID') == tripOwner.id && <HighlightOffIcon titleAccess="Remove Member" onClick={(e) => removeMember(e, member, trip.id)} />}
                    </div>
                </ListItemIcon>
            </ListItem>
        ));
    };

    return (
        <Card sx={{ width: '36vw', height: '50vh' }}>
          <CardContent>
            <List>
                <ListItem disablePadding>
                    <ListItemText primary={tripOwner.username + " (Owner)"} />
                    <ListItemIcon sx={{
                        marginLeft: '5rem',
                    }}>
                        <GroupAddIcon titleAccess="Add Member" onClick={() => setAddMember(!addMember)}/>
                    </ListItemIcon>
                </ListItem>
                <ListItem>
                    {addMember && 
                    <ThemeProvider theme={defaultTheme}>
                        <Grid container component="main" sx={{ height: '10vh' }}>
                        <CssBaseline />
                            <Box component="form" onSubmit={(e) => addMembers(e)} noValidate sx={{ mr: 2 }}>
                                {getNonMembers()}
                            </Box>
                            <Box style={{display: 'flex', gap: '10px', height: '3rem'}}>
                                {nonMembers.length > 0 && <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    onClick={(e) => addMembers(e)}
                                >
                                    Add Members
                                </Button>}
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    onClick={() => setAddMember(!addMember)}
                                >
                                    Cancel
                                </Button>
                            </Box>
                        </Grid>
                    </ThemeProvider>}
                </ListItem>
                {getTripMembers()}
            </List>
        </CardContent>
    </Card>
    )
}

export default GetTripMembers