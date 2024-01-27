//import { MongoClient } from 'mongodb';

/*const [activities, setActivities] = useState([]);
let uri = `mongodb+srv://testUser:LL0TlwSJy97L4v41@cluster0.rvgahvn.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri);
try {
    await client.connect();
    //const database = client.db('Belgium');
    //const collection = database.collection('Brussels');
    
    // Query for activities based on place_ids
    const cursor = collection.find({ "place_id": { "$in": place_ids } });
    const result = await cursor.toArray();
    console.log(result);
    setActivities(result);
} catch (error) {
    console.error('Error fetching activities:', error);
    throw error; // rethrow the error for handling elsewhere, if needed
} finally {
    // Ensures that the client will close when you finish/error
    await client.close();
}*/
import React, { useEffect, useState } from 'react';
const GetActivities = (props) => {
    const activities = props.ids.map(id => (
        <li className='list-group-item' key={id}>
            <h5>{id.split(";")[0]}</h5>
            <p>{id.split(";")[1]}</p>
        </li>
    ));

    return (
        <ul className='list-group'>
            {activities}
        </ul>
    );
}

export default GetActivities;