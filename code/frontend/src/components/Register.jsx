import React, { useState } from 'react';
import axios from 'axios';

function Register() {
  const [data, setData] = useState({
    username: "",
    email: "",
    password: ""
  });

  function handle (e) {
    const newData = {...data};
    newData[e.target.id] = e.target.value;
    setData(newData);
    //console.log(newData);
  }

  function submitForm(e) {
    e.preventDefault();
    if (data.username === "") {
      alert("Please enter a username");
    } else if (data.email === "") {
      alert("Please enter an email");
    } else if (data.password === "") {
      alert("Please enter a password");
    } else {
      axios.post(`register/`, {
        'username': data.username,
        'email': data.email,
        'password': data.password  // Include the pass
      })
      .then((response) => {
        console.log(response);
        window.location.href = '/login';
      })
      .catch((err) => console.error("Error:", err));
    }
  }
  

  return (
    <div>
      <form className="form-group" onSubmit={(e) => submitForm(e)}>
        <label htmlFor="username">Username </label>
        <input className="form-control" onChange={(e) => handle(e)} value={data.username} id="username" type='text'></input>
        <br />
        <label htmlFor="email">Email </label>
        <input className="form-control" onChange={(e) => handle(e)} value={data.email} id="email" type='email'></input>
        <br />
        <label htmlFor="password">Password </label>
        <input className="form-control" onChange={(e) => handle(e)} value={data.password} id='password' type='password'></input>
        <br />
        <button className="btn btn-primary" type='submit'>Register</button>
      </form>
    </div>
  );
}

export default Register