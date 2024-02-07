import axios from 'axios';
import React, { useState, useEffect } from 'react';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import AddModeratorIcon from '@mui/icons-material/AddModerator';
import { Button, List, ListItemIcon, ListItemText, MenuItem } from '@mui/material';
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
    
    // Members Function
    const handle = (e) => {
        const newData = { ...addedMembers };
        const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
        newData.members = selectedOptions;
        setAddedMembers(newData.members);
        console.log("newdata", newData);
    }

    const getNonMembers = () => {
        nonMembers = users.filter(user => (user.id != localStorage.getItem('sessionID') && !trip.members.includes(user.url)));
        if (nonMembers.length === 0) {
            return <MenuItem key="" value="">No users to add</MenuItem>
        }
        return <select className="form-control" onChange={(e) => handle(e)} id="members" multiple>
            {nonMembers.map(user => (
            <MenuItem key={user.id} value={user.id}>{user.username}</MenuItem>
        ))}
        </select>
    };

    const addMembers = (e) => {
        e.preventDefault();
        if (addedMembers.length === 0) {
            alert("Please select members to add.");
        } else {
            axios.post(`add-members/`, {
                'tripID': trip.id,
                'memberIDs': addedMembers
            })
            .then((response) => {
              console.log(response);
              window.location.reload();
            })
            .catch((err) => console.error("Error:", err));
        }
    };

    const removeMember = (e, member, tripID) => {
        e.preventDefault();
        axios.post(`remove-member/`, {
            'memberID': member.id,
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
            tripOwner.id != member.data.id && <ListItem disablePadding>
                <ListItemText primary={member.data.username} />
                <ListItemIcon sx={{
                    marginLeft: '5rem',
                }}>
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
                        <Grid container component="main" sx={{ height: '100vh' }}>
                        <CssBaseline />
                            <Box component="form" onSubmit={(e) => addMembers(e)} noValidate sx={{ mt: 1 }}>
                            <Select
                                  required
                                  fullWidth
                                  id="members"
                                  label="Members"
                                  name="members"
                                  autoComplete="members"
                                  autoFocus
                                  multiple
                                  defaultValue={''} // Provide the default value
                                  value={addedMembers} // Provide the array of selected members
                                  onChange={(e) => setAddedMembers(e.target.value)} // Update the state with selected members
                                >
                                  <MenuItem value={''}></MenuItem>
                                  {getNonMembers()}
                                </Select>
                            </Box>
                        </Grid>
                      <div style={{display: 'flex', gap: '10px'}}>{nonMembers.length > 0 && <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Add Members
                </Button>}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  onClick={() => setAddMember(!addMember)}
                >
                  Cancel
                </Button></div>
                    </ThemeProvider>}
                </ListItem>
                {getTripMembers()}
            </List>
        </CardContent>
    </Card>
    )
}

export default GetTripMembers