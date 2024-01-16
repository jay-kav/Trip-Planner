import React, { useState } from 'react';

function Register() {
  const url = "http://127.0.0.1:8000/"
  const [data, setData] = useState({
    username: "",
    email: "",
    password: ""
  })

  function handle (e) {
    const newData = {...data};
    newData[e.target.id] = e.target.value;
    setData(newData);
    //console.log(newData);
  }

  function submitForm(e) {
    e.preventDefault();
    fetch(`${url}register/`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: {
        username: data.username,
        email: data.email,
        password: data.password
      }
    })
    .then((response) => {
      console.log(response); // Log the entire response
      return response.json();
    })
    .then((responseData) => {
      console.log(responseData);
      window.location.reload();
    })
    .catch((err) => console.error("Error:", err));
  }
  

  return (
    <div>
      <form onSubmit={(e) => submitForm(e)}>
        <label>Username </label>
        <input onChange={(e) => handle(e)} value={data.username} id="username" type='text'></input>
        <br />
        <label>Email </label>
        <input onChange={(e) => handle(e)} value={data.email} id="email" type='email'></input>
        <br />
        <label>Password </label>
        <input onChange={(e) => handle(e)} value={data.password} id='password' type='password'></input>
        <br />
        <button type='submit'>Register</button>
      </form>
    </div>
  );
}

export default Register