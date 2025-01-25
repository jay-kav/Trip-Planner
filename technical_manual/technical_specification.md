# Technical Specification
## Table Of Contents

1. [Introduction](#1-introduction)
    1. [Overview](#11-overview)    
    2. [Glossary](#12-glossary)    
2. [Research](#2-research)
    1. [Web App](#21-web-app)
        1. [Django](#211-django)   
        2. [React](#212-react)
    2. [Databases](#22-databases)
        1. [PostgreSQL](#221-postgresql)
        2. [MongoDB Atlas](#222-mongoDB-atlas)
    3. [Algorithms](#23-algorithms)
        1. [Heuristics](#231-heuristics)
        2. [Distance Calculation](#232-distance-calculation)
    4. [Google Places API](#24-google-places-api)
3. [Design](#3-design)
    1. [System Architecture](#31-system-architecture)
    2. [Class Diagram](#32-class-diagram)
    3. [React Component Diagram](#33-react-component-diagram)
    4. [Use Cases](#34-use-cases)
        1. [User Authentication](#341-user-authentication)
        2. [User Creates Trip](#342-user-creates-trip)
        3. [User Views Trips](#343-user-views-trips)
        4. [User Deletes Trip](#344-user-deletes-trip)
        5. [User Changes Ownership Of Trip](#345-user-changes-ownership-of-trip)
        6. [User Adds Itinerary To Trip](#346-user-adds-itinerary-to-trip)
        7. [User Deletes Itinerary](#347-user-deletes-itinerary)
        8. [User Add Member To Trip](#348-user-add-member-to-trip)
        9. [User Removes Member](#349-user-removes-member)
    5. [Sequence Diagrams](#35-sequence-diagrams)
        1. [User Create An Account](#51-user-creates-an-account)
        2. [User Creates Trip](#52-user-creates-trip)
        3. [User Deletes Trip](#53-user-deletes-trip)
4. [Implementation](#4-implementation)
    1. [Frontend](#41-frontend)
    2. [Backend](#42-backend)
    3. [Algorithm](#43-algorithm)
5. [Problem and Solutions](#5-problem-and-solutions)
    1. [Frontend Not Communicating With Backend](#51-frontend-not-communicating-with-backend)
    2. [PostgreSQL Database Connection To Backend](#52=postgresql-database-connection-to-backend)
    3. [MongoDB Server Down](#53-mongodb-server-down)
    4. [Google Places Information](#54-google-places-information)
    5. [Geospatial Query](#55-geospatial-query)
    6. [Increase Document Capacity](#56-increase-document-capacity)
6. [Testing](#6-testing)
    1. [APIs Testing](#61-apis-testing)
    2. [Unit Testing](#62-unit-testing)
    3. [Functionality Testing](#63-functionality-testing)
    4. [User Testing](#64-user-testing)
7. [Installation Guide](#7-installation-guide)
8. [Appendix](#8-appendix)
    1. [Activity sheet](#81-activity-sheet)


## 1. Introduction
### 1.1 Overview
This project is a web application that centers around trip planning. You can share your created trips with others. You simply register an account or log in to your existing account on the web application. You can then use the web application to view their saved trips and create new ones. You can generate itineraries (things to do) based on your preferences (assortment of filters). You can create multiple itineraries across multi day trips. You can then view all itineraries, trip members and other information to do with the trip. The app makes organising and planning trips much easier, whether travelling alone or with others.
### 1.2 Glossary
**Python** - a beginner-friendly programming language known for its simplicity and readability, with a large community and extensive libraries for various tasks.\
**Javascript** - JavaScript is a programming language primarily used for creating interactive and dynamic web content, enabling functionality like animations, forms validation, and interactive user interfaces on websites.\
**PostgreSQL** - often referred to as Postgres, is a powerful open-source relational database management system used to store and manage structured data, supporting features like transactions, indexes, and complex queries.\
**Django** - a high-level Python web framework that simplifies and speeds up the development of web applications by providing tools and libraries for handling common web development tasks.\
**React.js** - a JavaScript library for building user interfaces, commonly used for creating dynamic and interactive web applications by efficiently managing the updating of components based on changes in data.\
**SQL** - ‘Structured Query Language’ is a standard programming language used to manage and manipulate relational databases, allowing users to store, retrieve, update, and delete data from databases.\
**MongoDB** - a popular NoSQL database that stores data in flexible, JSON-like documents, making it easy to handle and scale data for modern applications with diverse or rapidly changing data structures.\
**Material UI** - a popular React component library that offers pre-designed and customizable user interface elements following Google's Material Design guidelines, making it easier for developers to create visually appealing and consistent web applications.\
**API** - Application Programming Interface is a set of protocols and tools that allows different software applications to communicate and interact with one another. They facilitate data exchange and enable developers to access specific features or services without needing in-depth knowledge of the underlying systems.\
## 2. Research
This section will give a brief overview of the research we conducted so that we would be adequately prepared to undertake the design and implementation of our project.
### 2.1 Web App
#### 2.1.1 Django
Django is a framework for creating web applications using Python. It is the ideal way to build a solid backend for the app. This is because of its seamless integration with rest framework and Corsheaders to create secure applications. We have previous experience using Django for smaller assignments, but have never used it for a project of this scale. We had to do extensive research into the functionality of Django views, forms and serializers due to the very large functions that would need to be written for the itinerary generation.
#### 2.1.2 React
We used React for the frontend of the application. We had to look into the various modules such as Axios for making requests, Routers for navigating between pages and Material UI for CSS, to integrate with our React application. This would allow us to create a seamless user experience. We decided to use the React Leaflet library to generate the maps for the itineraries. This is not something we had used before so this required extensive research.
### 2.2 Databases
#### 2.2.1 PostgreSQL
By default Django uses SQLite3 for storing data. We discovered SQLite3 does not support an array type field, which is something we need for our models. We opted to use PostgreSQL for this reason. Use of PostgreSQL ArrayField in Django:

`activities = ArrayField(models.CharField())`

We had not used it before so we needed to research what was involved with the installation of the packages and set up a database. Then connect that database to our Django backend.
#### 2.2.2 MongoDB Atlas
For our project we couldn’t afford to continuously query Google Places API so we decided to choose a database to cache the results of our previous queries. MongoDB is a non-relational database that was chosen for its suitability in storing JSON documents and its support for geospatial querying, a feature we anticipated would greatly enhance our itinerary generator later on. Our exploration of MongoDB included mastering the setup of the database, creating collections, and designing the document structure within. Additionally, we delved into the process of connecting the database to our application using MongoDB drivers and PyMongo.
### 2.3 Algorithms
#### 2.3.1 Heuristics
Creating a perfect itinerary generator for our project posed challenges due to the inherent complexity which would have made it an NP-complete problem. To address this, we strategically employed heuristics to enhance manageability. The initial step involved categorizing activities into distinct groups, providing a foundation for heuristic application.

These heuristics played a pivotal role in determining the activity group based on the time of day. As Google did not offer predefined durations for locations, we assigned heuristic times to each location. This approach significantly contributed to the generation of well-crafted activities within the itinerary.
#### 2.3.2 Distance Calculation
There were limitations with the MongoDB geospatial query, as it struggled to precisely convert latitude and longitude coordinates into a reliable distance calculation. Initially, we considered incorporating third party solutions such as the Google Routes API or OpenStreetMap API for distance calculations. However, instead of outsourcing this functionality to a third party, we decided to challenge ourselves by exploring alternative methods.

To overcome this challenge, we researched the Manhattan distance formula and the Haversine formula. After conscientious consideration, we opted for the Haversine formula due to its suitability for calculating distances in unknown layouts. In contrast, the Manhattan formula is more appropriate for flat surfaces and city blocks, making it less applicable in European terrains where the landscape tends to be more varied compared to the organised grid-like structure commonly found in American cities. 

    def haversine(location1, location2):
    try:
        lon1 , lat1 = location1
        lon2 , lat2 = location2

        # convert decimal degrees to radians 
        lon1, lat1, lon2, lat2 = map(radians, [lon1, lat1, lon2, lat2])

        # haversine formula 
        dlon = lon2 - lon1 
        dlat = lat2 - lat1 
        a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
        c = 2 * asin(sqrt(a)) 

        # Radius of earth in kilometers
        r = 6371 
        # Return distance in kilometers
        return c * r


### 2.4 Google Places API
To gather the essential information required for our web app we needed to use an API. We conducted extensive research into both the Google Maps API and OpenStreetMaps API. While our obvious preference being Google Maps API due to its superior capabilities, we encountered a challenge related to its associated costs.

Our in-depth research of the Google Places API consisted of understanding how to establish connections, execute queries, and utilise the different products available with the API. The pivotal aspect of our research, however, revolved around identifying the most cost-effective approach to utilise the API's power without incurring additional expenses. This involved meticulous planning of the pricing structure for each query type, estimating the required number of documents, and assessing additional costs for specific information queries within each document.
## 3. Design
This shows off the various stages of the design process. This will include a number of use cases, sequence and data flow diagrams.
### 3.1 System Architecture
#### System Architecture Diagram
![System Architecture Diagram](technical_manual/images/Architecture_Overview_Diagram.png)
This diagram displays the system context, components, relationships, and dependencies. The user interacts with our system through the available input in the frontend React application. The frontend then has two-way communication with the Django backend, sending and requesting information. The backend saves all data to the PostgreSQL database. It also requests information from this. The backend sends requests to the MongoDB, and the requested information gets sent back to the backend. We use a python script to make requests to the Google Maps API and filter the information to send it to our MongoDB.
### 3.2 Class Diagram
![Class Diagram](technical_manual/images/class_diagram.png)

In this class diagram, the relationships between classes are represented by associations. For example, a User can create multiple Trips, and a Trip can have multiple Itineraries. Each Itinerary references the Trip it belongs to and contains a list of planned Activities. The Activity class represents the activities stored in MongoDB that are stored with specific details such as name, location, and time.

- **User**: This is a class to represent the user(s) interacting with a trip. Each user contains a name, email address and password. All of these are private and password in encrypted.
- **Trip**: A user creates an instance of a trip. A trip stores all the relevant information to do with a trip (ID, OwnerID, Trip Name, Country, City, Hotel, Start Date, End Date, Members, Created, Activities).
- **Itinerary**: Itineraries are also created by users. Each one contains a reference to a trip they are associated with. They store a list of activity place_ids with start and end times and type.
- **Activity**: Activities contain all the relevant information about each place. They are referenced in a list in each itinerary.

### 3.3 React Components
![React Component Diagram](technical_manual/images/component_diagram.png)

This diagram shows off the various components of the frontend application and how the interact with each other. The functionality of the components are as follows:

#### 3.3.1 Register
This component generates a registration form, so that the user can register an account if they don't already have one. It contains a function that hit the 'register/' endpoint in the backend.

![Register Component](technical_manual/images/Register.png)

#### 3.3.2 Login
This component generates a form to log the user into there account. User enters their account information and then the submit function hits the 'login/' endpoint to log the user in. The returned user ID is stored in the local storage to be used later.

![Login Component](technical_manual/images/Login.png)

#### 3.3.3 Navbar
The Navbar is used to navigate between pages from anywhere in the app. It does this by changing the current url of the app: `window.location.href = "/login";`

![Navbar Component](technical_manual/images/Navbar.png)

#### 3.3.4 GetTrips
This component gets all the users trips and displays them. It does this by hitting a rest framework endpoint. The users ID (which is stored in the local storage) is passed to this function: 
    
    axios.get(`api/trips/?members=${localStorage.getItem('sessionID')}`)

![Get Trips Component](technical_manual/images/GetTrips.png)

#### 3.3.5 ViewTrip
The user's selected trip is passed to the ViewTrip component. The component displays all the relevant information about the trip.

![View Trip Component](technical_manual/images/ViewTrip.png)

#### 3.3.6 GetTripMembers
This component retrieves all the members associated with the trip. It does this by making a post request to the backend with a list of user IDs. It displays the return list of Users

![Get Trip Members Component](technical_manual/images/GetTripMembers.png)

#### 3.3.7 GetItineraries
The itineraries that have the currently selected trip as their associated trip are displayed. This also contains a function for new itineraries to be created. A reference to the currently selected itinerary is then passed to the Map component

![Get Itineraries Component](technical_manual/images/GetItineraries.png)

#### 3.3.9 GetActivities
For the currently selected itinerary all the activities are retrieved. This is done by hitting an endpoint in the backend 'get-activities/' which interfaces with MongoDB to get the activities.

![Get Activities Component](technical_manual/images/GetActivities.png)

#### 3.3.9 Map
The Map component generates a map to reflect the itinerary currently displayed by the GetActivities component. It generates this map using Leaflet.

![Map Component](technical_manual/images/Map.png)

### 3.4 Use Cases
#### 3.4.1 User Authentication
| Name                          | User Registers An Account                                |
|-------------------------------|----------------------------------------------------------|
| Goal                          | User successfully creates a new account                  |
| Preconditions                 | User does not already have a registered account          |
| Successful Outcome            | User account is created                                  |
| Fail Outcome                  | User cannot be registered, incorrect information entered |
| Primary Actor(s)              | User                                                     |
| Main Scenario                 | 1. User opens web application                            |
|                               | 2. Clicks to register an account                         |
|                               | 3. Enters the required information                       |
|                               | 4. Clicks the register button                            |
|                               | 5. User account is created                               |
| Alternative Scenario          | - Incorrect information is entered                       |
|                               | - User account cannot be created                         |

| Name                          | User Logs In To Web App                                |
|-------------------------------|--------------------------------------------------------|
| Goal                          | User is logged into the web app                        |
| Preconditions                 | User has already registered an account in the system   |
| Successful Outcome            | User is logged in                                      |
| Fail Outcome                  | User cannot be logged in                               |
| Primary Actor(s)              | User                                                   |
| Main Scenario                 | 1. User opens web application                          |
|                               | 2. User enters correct account information             |
|                               | 3. User clicks login button                            |
|                               | 4. User is logged in                                   |
| Alternative Scenario          | - User enters incorrect information                    |
|                               | - User cannot be logged in                             |

| Name                   | User Logs Out                                    |
|------------------------|--------------------------------------------------|
| Goal                   | User logs out of the web application             |
| Preconditions          | User is logged in                                |
| Successful Outcome     | User is logged out                               |
| Fail Outcome           | User is unable to logout, due to system error    |
| Primary Actor(s)       | User                                             |
| Main Scenario          | 1. User is using the web application             |
|                        | 2. User clicks logout button                     |
|                        | 3. User is logged out                            |
| Alternative Scenario   | - Error occurs in the system                     |
|                        | - User cannot be logged out                      |

#### 3.4.2 User Creates Trip

| Name                   | User Creates Trip                                        |
|------------------------|----------------------------------------------------------|
| Goal                   | User creates a new trip                                  |
| Preconditions          | User is logged in                                        |
| Successful Outcome     | User creates a new trip                                  |
| Fail Outcome           | User cannot create a trip                                |
| Primary Actor(s)       | User                                                     |
| Main Scenario          | 1. User clicks the 'New Trip' button on the main screen  |
|                        | 2. User enters information for their trip                |
|                        | 3. User clicks the submit button                         |
|                        | 4. New trip is created                                   |
| Alternative Scenario   | - User enters incorrect information                      |
|                        | - New trip is not created                                |


#### 3.4.3 User Views Trips

| Name                   | User Views Trips                                                     |
|------------------------|----------------------------------------------------------------------|
| Goal                   | User views the trips they are a member of                            |
| Preconditions          | User has created a trip or has been added to a trip                  |
| Successful Outcome     | User can see a list of all their trips                               |
| Fail Outcome           | No trips can be seen                                                 |
| Primary Actor(s)       | User                                                                 |
| Main Scenario          | 1. User logs into the app                                            |
|                        | 2. All trips the user is a member of are retrieved from the database |
|                        | 3. A list of all the trips is displayed                              |
| Alternative Scenario   | - User is not a member of any trips                                  |
|                        | - No trips are listed                                                |


#### 3.4.4 User Deletes Trip

| Name                   | User Deletes Trip                                |
|------------------------|--------------------------------------------------|
| Goal                   | User deletes the trip                            |
| Preconditions          | User is the owner of a trip                      |
| Successful Outcome     | Selected trip is deleted from the system         |
| Fail Outcome           | Trip cannot be deleted                           |
| Primary Actor(s)       | User                                             |
| Main Scenario          | 1. User selects a trip to view                   |
|                        | 2. User clicks the 'delete trip' button          |
|                        | 3. Trip is deleted from the database             |
| Alternative Scenario   | - User is not the owner of the trip              |
|                        | - Trip cannot be deleted                         |


#### 3.4.5 User Changes Ownership Of Trip

| Name                          | User Changes Ownership Of Trip                                          |
|-------------------------------|-------------------------------------------------------------------------|
| Goal                          | A new user is made the owner of the selected trip                       |
| Preconditions                 | User must be the owner of a trip. Trip must have multiple members       |
| Successful Outcome            | Trip is given a new owner                                               |
| Fail Outcome                  | Trip cannot be assigned a new owner                                     |
| Primary Actor(s)              | User                                                                    |
| Main Scenario                 | 1. User selects one of their trips                                      |
|                               | 2. User clicks the badge beside the trip member they wish to make owner |
|                               | 3. Trip ownership is reassigned to the selected trip member             |
| Alternative Scenario          | - User is not the owner of the trip or is the only member of the trip   |
|                               | - Trip owner cannot be changed                                          |


#### 3.4.6 User Adds Itinerary To Trip

| Name                          | User Adds Itinerary To Trip                                       |
|-------------------------------|-------------------------------------------------------------------|
| Goal                          | New itinerary is added to the trip                                |
| Preconditions                 | User is the owner of a trip                                       |
| Successful Outcome            | User adds a newly generated itinerary to their selected trip      |
| Fail Outcome                  | User is unable to create an itinerary due to some error           |
| Primary Actor(s)              | User                                                              |
| Main Scenario                 | 1. User selects a trip                                            |
|                               | 2. User clicks the 'add itinerary' button                         |
|                               | 3. User fills in relevant information                             |
|                               | 4. Itinerary is generated and added to the trip                   |
| Alternative Scenario          | - User enters incorrect information or error occurs in the system |
|                               | - New itinerary cannot be generated                               |


#### 3.4.7 User Deletes Itinerary

| Name                          | User Deletes Itinerary                                         |
|-------------------------------|----------------------------------------------------------------|
| Goal                          | Selected itinerary is deleted from the trip                    |
| Preconditions                 | User is the owner of the trip. Itinerary has been created      |
| Successful Outcome            | User deletes the selected itinerary from their selected trip   |
| Fail Outcome                  | User is unable to delete the itinerary due to some error       |
| Primary Actor(s)              | User                                                           |
| Main Scenario                 | 1. User selects a trip                                         |
|                               | 2. User clicks the bin icon on their desired itinerary         |
|                               | 3. The chosen itinerary is deleted from the trip               |
| Alternative Scenario          | - User is unable to delete the itinerary due to some error     |


#### 3.4.8 User Add Member To Trip

| Name                          | User Add Member To Trip                                        |
|-------------------------------|----------------------------------------------------------------|
| Goal                          | New member is added to the trip                                |
| Preconditions                 | User must be the owner of a trip                               |
| Successful Outcome            | User adds a new member to the trip                             |
| Fail Outcome                  | User cannot add a new member to the trip                       |
| Primary Actor(s)              | User                                                           |
| Main Scenario                 | 1. User selects a trip                                         |
|                               | 2. User clicks the group add icon                              |
|                               | 3. User selects member(s) from the dropdown                    |
|                               | 4. User clicks the 'add members' button                        |
|                               | 5. Selected member(s) is/are added to the trip                 |
| Alternative Scenario          | - No member available to add                                   |
|                               | - User cannot add members to the trip                          |


#### 3.4.9 User Removes Member

| Name                          | User Removes Member                                            |
|-------------------------------|----------------------------------------------------------------|
| Goal                          | Member is removed from the trip                                |
| Preconditions                 | User is the owner of the trip. Trip must have multiple members |
| Successful Outcome            | User removes member from the trip                              |
| Fail Outcome                  | User is unable to remove member                                |
| Primary Actor(s)              | User                                                           |
| Main Scenario                 | 1. User selects trip                                           |
|                               | 2. User clicks remove icon beside the desired member           |
|                               | 3. Selected member is deleted from the trip                    |
| Alternative Scenario          | - There are no other members in the trip                       |
|                               | - Member(s) cannot be removed                                  |

### 3.5 Sequence Diagrams
#### 3.5.1 User Creates An Account
![Creates An Account](technical_manual/images/Creates_An_Account.png)

#### 3.5.2 User Creates A Trip
![Creates Trip](technical_manual/images/Creates_Trip.png)

#### 3.5.3 User Deletes Trip
![Delete Trip](technical_manual/images/Delete_Trip.png)

## 4. Implementation
### 4.1 Frontend
The frontend of the application was implemented using React.js. We decided to use this because it is easy to use and can be put together efficiently due to the design and reuse of components.
We used Axios for our fetch requests. This was installed using: `npm i axios` This was used for GET and POST requests. 

    axios.get('api/trips/')
    .then((response) => {
        console.log(response.data)
    })
    .catch((err) => console.error(err))

    axios.post('get-activites', {
        'country': country,
        'city': city,
        'activites': itinerary.activities
    })

We chose Axios over the default node fetch method as it was much simpler to use and more effective in what we needed it for. Nearly all information displayed on the page is retrieved through a post request made to an endpoint on the backend server (these endpoints are linked to functions that supply the data).
We made good use of react components, which allow for great reusability in sections of code and provide additional organisation to the project.

![React Components](technical_manual/images/React_Components.png)

On the 'View Trips' page a map with markers of activites can be seen.

![Leaflet Map](technical_manual/images/Map.png)

This was done using the React Leaflet library. This was installed using: `npm install react-leaflet`.Leaflet provides a number of React components to generate maps.

    <MapContainer center={[getLat(), getLong()]} zoom={13}>
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MarkerClusterGroup
                chunkedLoading
                iconCreateFunction={createClusterCustomIcon}
            >
                <Marker position={[hotel.lat, hotel.long]} icon={customIcon}>
                    <Popup>{hotel.name}</Popup>
                </Marker>
                {getMarkers(activities)}
            </MarkerClusterGroup>
        </div>
    </MapContainer>

We were able to generate an array of markers by taking an array of activities and mapping each one into a marker using the Leaflet Marker component.

    <Marker key={marker.place_id} position={[marker.latitude, marker.longitude]} icon={customIcon}>
        <Popup>{marker.name}    <img
            style={{height: '30pxwidth: '30pxborderRadius: '15pxobjectFit: 'cover'}}
            src={`data:image/jpbase64,${marker.image_da`}
            alt={marker.name}
        /></Popup>
    </Marker>

![Marker](technical_manual/images/Marker.png)

### 4.2 Backend
We needed a robust and secure framework for the backend of our web application. This is where Django comes in. Django can be installed using
`pip install Django`
This provided us with a number of tools such as views to add functionality

    @csrf_exempt
    def createTrip(request):
        if request.method == 'POST':
            try:
                data = json.loads(request.body)

urls to create endpoints for the frontend

`
path('create-trip/', views.createTrip, name='create_trip'),
`

and models to build the schema in our database.

    class Trip(models.Model):
        id = models.AutoField(primary_key=True)
        owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='owner')

To create new instance of an object
`
form.save()
`
was used. This is the standard way to do this Django, we found it was a more robust way of doing it, as opposed to patching information from the frontend.
To establish connection between the backend and MongoDB we used a Python library called PyMongo. This library was install using:

`
pip install pymongo
`

And imported into the application using:

`
from pymongo import MongoClient
`

The connection string could be found here:
![Connection1](technical_manual/images/Connection1.png)
![Connection2](technical_manual/images/Connection2.png)

Connection was then established with the MongoDB depending on the selected country and city

    client = MongoClient(get_env_value('MONGO_URL'))
    db = client[country]
    collection = db[city]

The function then queries the selected collection. The data is queried using find(), as seen in the below example:

`
hotels = collection.find({"types": "hotel"})
`

### 4.3 Algorithm
#### Algorithm Flowchart

![Algorithm Flowchart](technical_manual/images/Flow_diagram.png)
----



Our algorithm processes user inputs to create optimal itineraries, considering various specifications. Given that achieving a perfect itinerary is an NP-complete problem, our solution focuses on generating high-quality itineraries for users.

We chose to implement the algorithm in the backend of our web app using Python for increased efficiency compared to JavaScript. Initially split across seven files, we streamlined the algorithm to four modular files, each serving distinct purposes.

**User Input Processing** (itinerary.py):
This file transforms user inputs into a standardised format for processing. It converts dates into a numerical representation (0-6 for days of the week), changes times from hours to minutes, connects to the relevant database collection based on the specified location, and categorises preferences into groups for heuristic generation. The file validates the output from other files before saving it to the user's account.

**Itinerary Generation** (generator.py):
Responsible for creating the itinerary, this file incorporates user preferences and time-based heuristics. It interacts with the API communication file to fetch specific places or activities based on the generated heuristics. The algorithm creates and validates itineraries through a process of trial and error, backtracking when necessary until a valid solution is found. Once validated, the file appends location and time information to an array, sending it back to the user input processing file for storage.

**API Communication** (apiCalls.py):
This file facilitates communication with the database by sending specific queries based on information passed from the Itinerary Generation file. It has two functions, one to fetch a suitable place to eat and the other to identify activities around. How these functions find a suitable location is based on the users criteria. The functions ensure uniqueness and compliance with the user's timeframe, utilising a dictionary mapping heuristic times to activities. Each location it fetches is inside the defined distance set in the final file.

**Distance Calculation** (distanceCalculation.py):
This file houses the Haversine formula function for calculating distances between locations in kilometres. It assists in determining the distance travelled by the user, ensuring it doesn't exceed our walk threshold. The second function dynamically calculates the furthest distance achievable from home as time progresses, ensuring an appropriate distance for walking back home.
## 5. Problem and Solutions
### 5.1 Frontend Not Communicating With Backend
Early on in the development cycle when the initial project setup was happening, we ran into an issue where api endpoints set up in the backend would return Cors errors. We were stuck on this issue for a number of days. 

It turned out to be a csrf authentication error, which was fixed easily by adding
`
@csrf_exempt
`
before each view that required communication from the frontend.
### 5.2 PostgreSQL Database Connection To Backend
After switching from SQLite3 to PostgreSQL, there were some teething issues trying to get the database set up. It took some time to set up initially and then there was some connectivity issues between the database and the backend application

The problem was that the database information declared in Django settings.py didn’t align with the correct information set up for the PostgreSQL database. To fix this we remade the PostgreSQL database, this time making note of the information to ensure the correct information was then entered into the settings.
### 5.3 MongoDB Server Down 
Using MongoDB we encountered two problems. One, each time we changed location we couldn't gain access to the database as our IP addresses weren't registered to it. Two every so often MongoDB would be down without a reason and we were unable to access the database during them time frames. To prevent this from happening during essential times we decided to set up a local Mongo database. This ensured that we would have access to our data at all times. 

### 5.4 Google Places Information
While Google's API exhibited significant superiority over OpenStreetMap's API, we encountered an unexpected challenge. We realised that Google does not comprehensively regulate the information that it stores	. Numerous documents were either incomplete or lacked the implementation of certain fields. Compounding this issue, Google used various formats for presenting opening times of places this introduced complexities during information fetching. This posed a considerable challenge as our data showed inconsistencies. To address this, our strategy involved prioritizing essential information and identifying documents with the most consistent patterns.
### 5.5 Geo-spatial Query
A significant amount of the code was tailored during the algorithm's development to address a critical database query. Using geo-spatial queries in MongoDB was essential for proximity-based information filtering. However an unexpected problem emerged: MongoDB can only handle single-location geo-spatial queries, which means we are unable to compare multiple location distances at once. Testing revealed this constraint, which resulted in a major delay in our time-frame.

    query = {
        "types": {
            "$in": types
        },
        "$or": [
            {
                f"cleaned_times.{day}": {
                    "$ne": "Closed"
                },
                "geometry.location": {
                    "$near": {
                        "$geometry": {
                            "type": "Point",
                            "coordinates": [lat1, lon1]
                        },
                        "$maxDistance": 1000 
                    }
                }
            },
            {
                f"cleaned_times.{day}": {
                    "$ne": "Closed"
                },
                "geometry.location": {
                    "$near": {
                        "$geometry": {
                            "type": "Point",
                            "coordinates": [lat2, lon2]
                        },
                        "$maxDistance": 1000
                    }
                }
            }
        ]
    }

To overcome this , we took a step back and sought an alternative solution. We found our answer in the haversine formula, which enabled us to ensure that each selected location remained within a defined distance from our starting point. This alternative not only addressed the issue but also proved to be an effective and efficient means of achieving our objective.
### 5.6 Increase Document Capacity

During the project's early stages, we tested the system's performance and connection reliability by retrieving a small number of documents from the Google API. We encountered a problem as our demand for additional data increased. The API didn’t consistently return new documents. We were then forced to accept duplicate documents to solve this, which resulted in extra expenses since we had to get the same data repeatedly before finally obtaining new data. We were able to proceed with obtaining the data required for the development of our application from this workaround.
### 5.7 Syncing Map Component With Current Itinerary
We were having the issue where we couldn't get the map to display the same content as the itinerary component. To fix this we used React referencing. We took the current itinerary and passed its list of activities back up to the ViewTrip component 

    useEffect(() => {
      if (itineraries.length > 0) {
        onAction(itineraries[currentItineraryIndex].activities);
      }
    })

and then the ViewTrip 

    const [sharedState, setSharedState] = useState([]);
    const handleFunctionCallFromSiblingOne = (value) => setSharedState(value); 
    
component passed the list of activities back down to the Map component via a prop:

    <Map trip={trip} sharedState={sharedState} />

## 6. Testing
### 6.1 APIs Testing
Two additional folders named ‘python_scripts’ and ‘test_scripts’ can be found in the code directory of the project. These are a collection of scripts that were used to test and establish connection with the Google Maps API and the MongoDB API. These scripts were also used to validate that incoming information was structured in the desired format.
### 6.2 Unit Testing
We used the standard unit testing library that comes with Python, unittest. Imported using Django
`from django.text import TestCase`
This comes with a class type TestCase which is used to create classes to test parts of the application. We used this to create unit tests for creation of our models (User, Trip, Itinerary). Unit tests were automatically executed using:

`python3 manage.py test`

![Improvements](technical_manual/images/test_case.png)
---
![Improvements](technical_manual/images/case1.png)
---
![Improvements](technical_manual/images/case2.png)
---
![Improvements](technical_manual/images/case3.png)

### 6.3 Functionality Testing
We tested all functionality of the application, by entering sample data in to create sample users, trips and itineraries. With these example instances in place we were able to test all the functionalities.
- User Functions: Registration, Login, Logout
- Trip Functions: Create Trip, View Trip, Delete Trip, Clear Activities
- Itinerary Functions: Create Itinerary, Delete Itinerary
- Trip Member Functions: Add Members, Leave Trip, Remove Members, Change Trip Owner

For any functions that required a form to be filled out every form input was vigorously tested with various combinations of information to ensure proper functionality. This allowed us to find out if all functions were working correctly and repair any issues before beginning user testing.

Example of what a test case looks like:
![Example Test Case](technical_manual/images/Testcase.png)

### 6.4 User Testing
We carried out user testing to fully evaluate the robustness of our application. Actively engaging with potential users, we provided an activity sheet [(See here.)](#81-activity-sheet) designed to guide them through all available functions, ensuring they explored each feature. After finishing the activities, users were urged to deliberately test the application's limitations by looking to identify possible problems or difficulties. After testers were satisfied they were provided with a survey form to share their feedback, allowing us to gather valuable insights for further enhancements to our application.

Through this feed back we were able to enhance the UI, fix bugs we wouldn't have identified , added in features to help users understanding and improve the itinerary generators performance.


Below is the demographic split of our testing, we aimed to test Journo on multiple ages groups with varying technological proficiencies.
![Demographic](technical_manual/images/Demographic.png)

Below is feedback from users on what we needed to incorporate for our final submission.

![Experience](technical_manual/images/experience.png)
![Delays](technical_manual/images/delay.png)
![Challenges](technical_manual/images/challenges.png)
![Feedback](technical_manual/images/feedback.png)
![Improvements](technical_manual/images/improvements.png)




## 7. Installation Guide
1. User must clone the repo: `git clone https://gitlab.computing.dcu.ie/kavane39/2024-ca326-kavane39-tripplanner.git`
2. Download PostgreSQL and create a database with the following information:

    NAME='postgres'
    USER='admin'
    PASSWORD='D1c2u3!?'

3. Initialise environment variable by copying and executing the contents of env.txt
4. Navigate to the backend folder and execute `pip install -r requirements.txt`
5. Then execute: `python3 manage.py makemigrations`
6. Then execute: `python3 manage.py migrate`
7. Then execute: `python3 manage.py runserver`
8. Navigate to frontend folder and execute `npm install`
9. Then execute `npm start`
10. Open a browser to `localhost:3000`

## 8. Appendix
## 8.1 Activity Sheet

![Activity sheet](technical_manual/images/activity.png)
![Activity sheet 2](technical_manual/images/activity2.png)


