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
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

const defaultTheme = createTheme();

function GetTripMembers(props) {
    let tripOwner = props.tripOwner;
    let trip = props.trip;
    let nonMembers;
    
    const [addMember, setAddMember] = useState(false);
    const [addedMembers, setAddedMembers] = useState([]);
    const [tripMembers, setTripMembers] = useState([]);
    const [users, setUsers] = useState([]);
    const [member, setMember] = useState("");
    const [showRemoveConfirmation, setShowRemoveConfirmation] = useState(false);
    const [showChangeConfirmation, setShowChangeConfirmation] = useState(false);
    const [showAddConfirmation, setShowAddConfirmation] = useState(false);

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
            sx={{width: '20vw'}}
        >
            <MenuItem key={"default"} value={''}></MenuItem>
            {nonMembers.map(user => (
                <MenuItem key={user.id} value={user.id}>{user.username}</MenuItem>
            ))}
        </Select>
    };

    const addMembers = (e) => {
        e.preventDefault();
        setShowAddConfirmation(true);
    };

    const confirmAddMembers = () => {
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
    }

    const handleAddCloseConfirmation = () => {
        setShowAddConfirmation(false); // Close confirmation dialog
    };

    const removeMember = (e, member) => {
        e.preventDefault();
        setMember(member);
        setShowRemoveConfirmation(true);
    }

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

    const changeOwner = (e, member) => {
        e.preventDefault();
        setMember(member);
        setShowChangeConfirmation(true);
    }

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
                    <ListItemIcon sx={{
                        marginLeft: '5rem',
                    }}>
                        {localStorage.getItem('sessionID') == tripOwner.id && <GroupAddIcon titleAccess="Add Member" onClick={addMembers}/>}
                    </ListItemIcon>
                </ListItem>
                {getTripMembers()}
            </List>
        </CardContent>
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