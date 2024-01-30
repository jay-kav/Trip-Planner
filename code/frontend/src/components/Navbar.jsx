import axios from 'axios';
import * as React from 'react';

export default function Navbar(props) {  
  const logout = (e) => {
    e.preventDefault();
    localStorage.clear();
    axios.post(`logout/`)
    .then((response) => {
      console.log(response);
      window.location.href = '/login';
    })
    .catch((err) => console.error("Error:", err));
  }

  const redirect = (e, url) => {
    e.preventDefault();
    window.location.href = url;
  }

  return (
    <div style={{position: 'fixed', width: '15%'}}>
      <ul className='list-group' style={{background: 'black', height: '100%', paddingLeft: '15px', paddingTop: '20px'}}>
        <li className='list-group-item' id="nav"><button onClick={(e) => redirect(e, "/")}>Trip Planner</button></li>
        <li className='list-group-item' id="nav"><button onClick={(e) => redirect(e, "/")}>View Trips</button></li>
        <li className='list-group-item' id="nav"><button onClick={(e) => redirect(e, "/")}>Create Trip</button></li>
        <br />
        <li className='list-group-item' id="nav"><button onClick={(e) => logout(e)}>Logout</button></li>
    </ul>
    </div>    
  );
}