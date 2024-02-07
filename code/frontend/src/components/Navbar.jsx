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

    const logout = () => {
        axios.post('logout/')
        .then((response) => {
            console.log(response);
            localStorage.clear();
            window.location.href = "/login";
        })
        .catch((err) => console.error("Error:", err));
    }

    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
          return;
        }
    
        setState({ ...state, [anchor]: open });
    };

    const list = (anchor) => (
        <Box
            sx={{ width: 250 }}
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
        >
          <List>
              <ListItem key={'Journo'} disablePadding>
                <ListItemButton onClick={() => {window.location.href = '/'}}>
                  <ListItemIcon>
                    <InboxIcon />
                  </ListItemIcon>
                  <ListItemText primary={'Journo'} />
                </ListItemButton>
              </ListItem>
              <ListItem key={'My Trips'} disablePadding>
                <ListItemButton onClick={() => {window.location.href = '/'}}>
                  <ListItemIcon>
                    <HomeRoundedIcon />
                  </ListItemIcon>
                  <ListItemText primary={'My Trips'} />
                </ListItemButton>
              </ListItem>
              <ListItem key={'Create Trip'} disablePadding>
                <ListItemButton onClick={() => {window.location.href = '/createtrip'}}>
                  <ListItemIcon>
                    <AddCircleOutlineRoundedIcon />
                  </ListItemIcon>
                  <ListItemText primary={'Create Trip'} />
                </ListItemButton>
              </ListItem>
          </List>
          <Divider />
          <List>
              <ListItem key={'logout'} onClick={() => logout()} disablePadding>
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

    return (
        <React.Fragment key={'left'}>
          <MenuRoundedIcon sx={{ mx: 1, position: 'fixed' }} fontSize='large' onClick={toggleDrawer('left', true)} />
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