import React, { useState, useEffect } from 'react'

function Users() {
  const url = "http://127.0.0.1:8000/"
  const [users, setUsers] = useState([]);

  const getUsers = () => {
    return users.map(user => (
      <div key={user.id}>
        <h3>{user.id} - {user.email}</h3>
      </div>
    ));
  };  

  useEffect(() => {
    if (users.length === 0) {
        fetch(url + "users/")
        .then((response) => response.json())
        .then((data) => {
            setUsers(data);
        })
        .catch(err => console.log(err))
    }
  });

  return (
    <div>
        {getUsers()}
    </div>
  )
}

export default Users