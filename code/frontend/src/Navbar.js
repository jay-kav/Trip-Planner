import * as React from 'react';
import url from './components/url';

export default function Navbar(props) {  
  const logout = (e) => {
    e.preventDefault();
    fetch(`${url}logout/`, {
        method: 'POST',
        headers: { "Content-type": "application/json" }
    })
    .then((response) => {
      console.log(response); // Log the entire response
      return response.json();
    })
    .then((responseData) => {
      console.log(responseData);
      localStorage.clear();
      window.location.href = '/login';
    })
    .catch((err) => console.error("Error:", err));
  }

  const redirect = (e, url) => {
    e.preventDefault();
    window.location.href = url;
  }

  return (
    <nav className="navbar navbar-dark bg-dark">
      <a className="navbar-brand" style={{paddingLeft: '30px'}} href='/'>Trip Planner</a>
        <ul className="navbar-nav mr-auto">
        {
            props.pathname === "/register" ? <button className="btn btn-dark" color="inherit" onClick={(e) => redirect(e, "/login")}>Login</button>
            : props.pathname === "/login" ? <button className="btn btn-dark" color="inherit" onClick={(e) => redirect(e, "/register")}>Register</button>
            : props.pathname === "/newtrip" ? <button className="btn btn-dark" color="inherit" onClick={(e) => logout(e)}>Logout</button>
            : <button className="btn btn-dark" color="inherit" onClick={(e) => logout(e)}>Logout</button>
          }
        </ul>
    </nav>
    
  );
}