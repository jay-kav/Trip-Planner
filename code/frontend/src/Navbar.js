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

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <h3 className="navbar-brand" style={{paddingLeft: '30px'}}>Trip Planner</h3>
      <div className="collapse navbar-collapse"  id="navbarSupportedContent">
        <ul className="navbar-nav mr-auto">
        {
            props.pathname === "/register" ? <button className="btn btn-dark" color="inherit" href='/login'>Login</button>
            : props.pathname === "/login" ? <button className="btn btn-dark" color="inherit" href='/register'>Register</button>
            : props.pathname === "/newtrip" ? <button className="btn btn-dark" color="inherit" onClick={(e) => logout(e)}>Logout</button>
            : <button className="btn btn-dark" color="inherit" onClick={(e) => logout(e)}>Logout</button>
          }
        </ul>
      </div>
    </nav>
    
  );
}