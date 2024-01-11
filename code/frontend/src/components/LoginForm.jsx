import React from 'react'

const url = "127.0.0.1/api/"

function LoginForm() {
  const submitForm = () => {
    let email = document.getElementById('email');
    let pwd = document.getElementById('pwd');

    fetch(url + "user/", {
        method: "POST",
        body: JSON.stringify({
            'email': email,
            'password': pwd
        }),
        headers: {
            "Content-type": "application/json"
        }
    })
    .then((response) => response.json())
    .then((json) => console.log(json));
  }

  return (
    <div>
        <form>
            <label>Email</label>
            <input id="email" type='email'></input>
            <label>Password</label>
            <input id='pwd' type='password'></input>
            <button onClick={submitForm()}>Register</button>
        </form>
    </div>
  )
}

export default LoginForm