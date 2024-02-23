import axios from 'axios';
import React, { useState, useEffect } from 'react';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import AddModeratorIcon from '@mui/icons-material/AddModerator';
import { Button, List, ListItemIcon, ListItemText, MenuItem, Typography } from '@mui/material';
import ListItem from '@mui/material/ListItem';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import { Box } from '@mui/material';
import Select from '@mui/material/Select';
import { Card, CardContent } from '@mui/material';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';


function GetTripMembers(props) {
    let tripOwner = props.tripOwner;
    let trip = props.trip;
    let nonMembers;

    const [addedMembers, setAddedMembers] = useState([]);
    const [tripMembers, setTripMembers] = useState([]);
    const [users, setUsers] = useState([]);
    const [member, setMember] = useState("");
    const [showRemoveConfirmation, setShowRemoveConfirmation] = useState(false);
    const [showChangeConfirmation, setShowChangeConfirmation] = useState(false);
    const [showAddConfirmation, setShowAddConfirmation] = useState(false);

    // Fetch requests
    useEffect(() => {
        if (!tripMembers.length) {
            Promise.all(trip.members.map(member =>  // maps each member in the array to a get request
                axios.get(`api/users/${member.split("/").slice(-2).slice(0, -1)}`) // Get user data from member URL
            ))
            .then(response => {
                console.log(response);
                setTripMembers(response);
            })
            .catch(err => console.log(err));
        }
        if (!users.length) {
            axios.get("api/users/?is_staff=false") // Get all non-staff users
            .then((response) => {
                if (response.data.length) {
                    setUsers(response.data);
                }
            })
            .catch(err => console.log(err))
        }
    });

    // shows select menu to add members to the trip
    const addMembers = (e) => {
        e.preventDefault();
        setShowAddConfirmation(true);
    };

    // adds selected members to the trip
    const confirmAddMembers = () => {
        if (addedMembers.length === 0) {
            alert("Please select members to add.");
        } else {
            axios.post(`add-members/`, {    // Post request to add members to the trip
                'tripID': trip.id,
                'memberIDs': addedMembers
            })
            .then((response) => {
              console.log(response);
              window.location.reload();
            })
            .catch((err) => console.error("Error:", err));
        }
    }

    // handles closing of add members dialog box
    const handleAddCloseConfirmation = () => {
        setShowAddConfirmation(false); // Close confirmation dialog
    };

    // confirmation box to prevent accidental member deletion
    const removeMember = (e, member) => {
        e.preventDefault();
        setMember(member);
        setShowRemoveConfirmation(true);
    }

    // removes selected member from the trip
    const confirmRemoveMember = () => {
        axios.post(`remove-member/`, {
            'memberID': member.data.id,
            'tripID': trip.id
        })
        .then((response) => {
            console.log(response);
            window.location.reload();
        })
        .catch((err) => console.error("Error:", err));
    }

    const handleRemoveCloseConfirmation = () => {
        setShowRemoveConfirmation(false); // Close confirmation dialog
    };

    // confirmation box to prevent accidental change of trip owner
    const changeOwner = (e, member) => {
        e.preventDefault();
        setMember(member);
        setShowChangeConfirmation(true);
    }

    // changes the owner of the trip to the selected member
    const confirmChangeOwner = () => {
        axios.post(`change-owner/`, {
            'memberID': member.id,
            'tripID': trip.id
        })
        .then((response) => {
            console.log(response);
            window.location.reload();
        })
        .catch((err) => console.error("Error:", err));
    }

    const handleChangeCloseConfirmation = () => {
        setShowChangeConfirmation(false); // Close confirmation dialog
    };

    // get all users that aren't currently a member of the trip and return them in a list of MenuItem components
    const getNonMembers = () => {
        nonMembers = users.filter(user => (user.id != localStorage.getItem('sessionID') && !trip.members.includes(user.url))); // filters out current trip members
        console.log("nonMembers", nonMembers);
        // default behavior if no new members are available
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
            sx={{width: '20vw'}}
        >
            <MenuItem key={"default"} value={''}></MenuItem>
            {nonMembers.map(user => (
                <MenuItem key={user.id} value={user.id}>{user.username}</MenuItem>
            ))}
        </Select>
    };

    // maps current trip members to list items
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
        <Card sx={{ width: '21vw', height: '28vh' }}>
          <CardContent>
            <Typography variant="h6" component="div" gutterBottom>Trip Members</Typography>
            <List sx={{overflowY:'scroll', height: '20vh'}}>
                <ListItem disablePadding>
                    <ListItemText primary={tripOwner.username + " (Owner)"} />
                    <ListItemIcon sx={{marginLeft: '5rem'}}>
                        {localStorage.getItem('sessionID') == tripOwner.id && <GroupAddIcon titleAccess="Add Member" onClick={addMembers}/>} {/* Hides trip owner function from non trip owners */}
                    </ListItemIcon>
                </ListItem>
                {getTripMembers()}
            </List>
        </CardContent>
        {/* Dialog Boxes */}
        <Dialog
            open={showRemoveConfirmation}
            onClose={handleRemoveCloseConfirmation}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{"Are you sure you want to remove this member from the trip?"}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    This action cannot be undone.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleRemoveCloseConfirmation} color="primary">
                    Cancel
                </Button>
                <Button onClick={confirmRemoveMember} color="primary" autoFocus>
                    Remove
                </Button>
            </DialogActions>
        </Dialog>
        <Dialog
            open={showChangeConfirmation}
            onClose={handleChangeCloseConfirmation}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{"Are you sure you want to make this member owner of the trip?"}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    This action cannot be undone.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleChangeCloseConfirmation} color="primary">
                    Cancel
                </Button>
                <Button onClick={confirmChangeOwner} color="primary" autoFocus>
                    Change Owner
                </Button>
            </DialogActions>
        </Dialog>
        <Dialog
            open={showAddConfirmation}
            onClose={handleAddCloseConfirmation}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{"Add Members"}</DialogTitle>
                <Box component="form" onSubmit={(e) => addMembers(e)} noValidate sx={{ m: '3vw 10vw' }}>
                    {getNonMembers()}
                </Box>
            <DialogActions>
                <Button onClick={handleAddCloseConfirmation} color="primary">
                    Cancel
                </Button>
                <Button onClick={confirmAddMembers} color="primary" autoFocus>
                    Add Members
                </Button>
            </DialogActions>
        </Dialog>
    </Card>
    )
}

export default GetTripMembers