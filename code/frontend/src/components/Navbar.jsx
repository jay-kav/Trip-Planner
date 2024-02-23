import React from 'react';
import axios from 'axios';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider } from '@mui/material';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import { useState } from 'react';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import ExitToAppRoundedIcon from '@mui/icons-material/ExitToAppRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';

function Navbar() {
    const [state, setState] = useState(false);

    // handles user logging out, redirects to login page
    const logout = () => {
        axios.post('logout/')
        .then((response) => {
            console.log(response);
            localStorage.clear();
            window.location.href = "/login";
        })
        .catch((err) => console.error("Error:", err));
    }

    // handles opening/closing of navbar
    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
          return;
        }
    
        setState({ ...state, [anchor]: open });
    };

    // creates list of navbar items
    // https://mui.com/material-ui/react-app-bar/#responsive-app-bar-with-drawer
    const list = (anchor) => (
        <Box
            sx={{ width: 250 }}
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
        >
          <List>
              <ListItem key={'Journo'} disablePadding>
                <ListItemButton onClick={() => {sessionStorage.setItem('selected', null); window.location.href = '/'}}>
                  <ListItemIcon>
                    <InboxIcon />
                  </ListItemIcon>
                  <ListItemText primary={'Journo'} />
                </ListItemButton>
              </ListItem>
              <ListItem key={'My Trips'} disablePadding>
                <ListItemButton onClick={() => {sessionStorage.setItem('selected', null); window.location.href = '/'}}>
                  <ListItemIcon>
                    <HomeRoundedIcon />
                  </ListItemIcon>
                  <ListItemText primary={'My Trips'} />
                </ListItemButton>
              </ListItem>
              <ListItem key={'Create Trip'} disablePadding>
                <ListItemButton onClick={() => {sessionStorage.setItem('selected', null); window.location.href = '/createtrip'}}>
                  <ListItemIcon>
                    <AddCircleOutlineRoundedIcon />
                  </ListItemIcon>
                  <ListItemText primary={'Create Trip'} />
                </ListItemButton>
              </ListItem>
          </List>
          <Divider />
          <List>
              <ListItem key={'logout'} onClick={() => {
                logout();
                sessionStorage.setItem('selected', null);
              }} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <ExitToAppRoundedIcon />
                  </ListItemIcon>
                  <ListItemText primary={'Logout'} />
                </ListItemButton>
              </ListItem>
          </List>
        </Box>
      );

    // displays the navbar icon
    return (
        <React.Fragment key={'left'}>
          <MenuRoundedIcon sx={{ mx: 1, mt: 2, position: 'fixed' }} fontSize='large' onClick={toggleDrawer('left', true)} />
          <Drawer
            anchor={'left'}
            open={state['left']}
            onClose={toggleDrawer('left', false)}
          >
            {list('left')}
          </Drawer>
        </React.Fragment>
    )
}

export default Navbar