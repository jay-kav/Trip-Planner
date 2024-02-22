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
    2. [Use Cases](#32-use-cases)
        1. [User Authentication](#321-user-authentication)
        2. [User Creates Trip](#322-user-creates-trip)
        3. [User Views Trips](#323-user-views-trips)
        4. [User Deletes Trip](#324-user-deletes-trip)
        5. [User Changes Ownership Of Trip](#325-user-changes-ownership-of-trip)
        6. [User Adds Itinerary To Trip](#326-user-adds-itinerary-to-trip)
        7. [User Deletes Itinerary](#327-user-deletes-itinerary)
        8. [User Add Member To Trip](#328-user-add-member-to-trip)
        9. [User Removes Member](#329-user-removes-member)
4. [Implementation](#4-implementation)
    1. [React Frontend](#41-react-frontend)
    2. [Django Backend](#42-django-backend)
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


## 1. Introduction
### 1.1 Overview
This project is a web application that users can use to make plans for a trip. The users can share their created trips with others. The user registers or logs in to their account on the web application. This user's information is then saved to a cloud database. The user can then use the web application to view their saved trips and create new ones. The app will generate an itinerary (list of things to do) and associate it with your created trip. You can then view all itineraries, trip members and other information to do with the trip.
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
We used React for the frontend of the application. We had to look into the various modules such as Axios for making requests, Routers for navigating between pages and Material UI for CSS, to integrate with our React application. This would allow us to create a seamless user experience.
### 2.2 Databases
#### 2.2.1 PostgreSQL
By default Django uses SQLite3 for storing data. We discovered SQLite3 does not support an array type field, which is something we need for our models. We opted to use PostgreSQL for this reason. Use of PostgreSQL ArrayField in Django:

`activities = ArrayField(models.CharField())`

We had not used it before so we needed to research what was involved with the installation of the packages and set up a database. Then connect that database to our Django backend.
#### 2.2.2 MongoDB Atlas
For our project we couldn’t afford to continuously query Google Places API so we needed to choose a database to store the information. MongoDB is a non-relational database that was chosen for its suitability in storing JSON documents and its support for geospatial querying, a feature we anticipated would greatly enhance our itinerary generator later on. Our exploration of MongoDB included mastering the setup of the database, creating collections, and designing the document structure within. Additionally, we delved into the process of connecting the database to our application using MongoDB drivers and PyMongo.
### 2.3 Algorithms
#### 2.3.1 Heuristics
Creating a perfect itinerary generator for our project posed challenges due to the inherent complexity which would have made it an NP-complete problem. To address this, we strategically employed heuristics to enhance manageability. The initial step involved categorizing activities into distinct groups, providing a foundation for heuristic application.

These heuristics played a pivotal role in determining the activity group based on the time of day. As Google did not offer predefined durations for locations, we assigned heuristic times to each location. This approach significantly contributed to the generation of well-crafted activities within the itinerary.
#### 2.3.2 Distance Calculation
There were limitations with the MongoDB geospatial query, as it struggled to precisely convert latitude and longitude coordinates into a reliable distance calculation. Initially, we considered incorporating third party solutions such as the Google Routes API or OpenStreetMap API for distance calculations. However, instead of outsourcing this functionality to a third party, we decided to challenge ourselves by exploring alternative methods.

To overcome this challenge, we researched the Manhattan distance formula and the Haversine formula. After conscientious consideration, we opted for the Haversine formula due to its suitability for calculating distances in unknown layouts. In contrast, the Manhattan formula is more appropriate for flat surfaces and city blocks, making it less applicable in European terrains where the landscape tends to be more varied compared to the organised grid-like structure commonly found in American cities. 
### 2.4 Google Places API
To gather the essential information required for our web app we needed to use an API. We conducted extensive research into both the Google Maps API and OpenStreetMaps API. While our obvious preference being Google Maps API due to its superior capabilities, we encountered a challenge related to its associated costs.

Our in-depth research of the Google Places API consisted of understanding how to establish connections, execute queries, and utilise the different products available with the API. The pivotal aspect of our research, however, revolved around identifying the most cost-effective approach to utilise the API's power without incurring additional expenses. This involved meticulous planning of the pricing structure for each query type, estimating the required number of documents, and assessing additional costs for specific information queries within each document.
## 3. Design
This shows off the various stages of the design process. This will include a number of use cases, sequence and data flow diagrams.
### 3.1 System Architecture
#### System Architecture Diagram
![System Architecture Diagram](technical_manual/images/Architecture_Overview_Diagram.png)
This diagram displays the system context, components, relationships, and dependencies. The user interacts with our system through the available input in the frontend React application. The frontend then has two-way communication with the Django backend, sending and requesting information. The backend saves all data to the PostgreSQL database. It also requests information from this. The backend sends requests to the MongoDB, and the requested information gets sent back to the backend. We use a python script to make requests to the Google Maps API and filter the information to send it to our MongoDB.
### 3.2 Use Cases
#### 3.2.1 User Authentication
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

#### 3.2.2 User Creates Trip

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


#### 3.2.3 User Views Trips

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


#### 3.2.4 User Deletes Trip

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


#### 3.2.5 User Changes Ownership Of Trip

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


#### 3.2.6 User Adds Itinerary To Trip

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


#### 3.2.7 User Deletes Itinerary

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


#### 3.2.8 User Add Member To Trip

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


#### 3.2.9 User Removes Member

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

## 4. Implementation
### 4.1 React Frontend
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

We chose Axios over the default node fetch method as it was much simpler to use and more effective in what we needed it for. We used the map function

    return itineraries.map((itinerary, index) => (
          <Card key={itinerary.id}>
            <Box>
              <Box
                <h5>{getDate(itinerary.date)}</h5>
              </Box>
            </Box>
          </Card>
        ));

to map all elements of a list into JavaScript objects. 
### 4.2 Django Backend
We need a robust and secure framework for the backend of our web application. This is where Django comes in. Django can be installed using
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
After switching from SQLite3 to PostgreSQL, there were some teething issues trying to get the database set up. It took some time to set up initially and then there was some connectivity issues between the database and backend application

The problem was that the database information declared in Django settings.py didn’t align with the correct information set up for the Postgres database. To fix this we remade the Postgres database, this time making note of the information to ensure the correct information was then entered into the settings.
### 5.3 MongoDB Server Down 
Using mongodb we encountered to two problems. One each time we changed location we couldnt gain access to the database as our IP address wasnt registered to it. Two every so often mongodb would be down without a reason and we were unable to access the database during them time frames.

### 5.4 Google Places Information
While Google's API exhibited significant superiority over OpenStreetMap's API, we encountered an unexpected challenge. We realised that Google does not comprehensively regulate the information that it stores	. Numerous documents were either incomplete or lacked the implementation of certain fields. Compounding this issue, Google used various formats for presenting opening times of places this introduced complexities during information fetching. This posed a considerable challenge as our data showed inconsistencies. To address this, our strategy involved prioritizing essential information and identifying documents with the most consistent patterns.
### 5.5 Geospatial Query
A significant amount of the code was tailored during the algorithm's development to address a critical database query. Using geospatial queries in MongoDB was essential for proximity-based information filtering. However an unexpected problem emerged: MongoDB can only handle single-location geospatial queries, which means we are unable to compare multiple location distances at once. Testing revealed this constraint, which resulted in a major delay in our timeframe.

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

## 6. Testing
### 6.1 APIs Testing
Two additional folders named ‘python_scripts’ and ‘test_scripts’ can be found in the code directory of the project. These are a collection of scripts that were used to test and establish connection with the Google Maps API and the MongoDB API. These scripts were also used to validate that incoming information was structured in the desired format.
### 6.2 Unit Testing
We used the standard unit testing library that comes with Python, unittest. Imported using Django
from django.text import TestCase
This comes with a class type TestCase which is used to create classes to test parts of the application. We used this to create unit tests for creation of our models (User, Trip, Itinerary). Unit tests were automatically executed using:

`python3 manage.py test`

### 6.3 Functionality Testing
We tested all functionality of the application, by entering sample data in to create sample users, trips and itineraries. With these example instances in place we were able to test all the functionalities.
User Functions: Registration, Login, Logout
Trip Functions: Create Trip, View Trip, Delete Trip, Clear Activities
Itinerary Functions: Create Itinerary, Delete Itinerary
Trip Member Functions: Add Members, Leave Trip, Remove Members, Change Trip Owner
For any functions that required a form to be filled out every form input was vigorously tested with various combinations of information to ensure proper functionality. This allowed us to find out if all functions were working correctly and repair any issues before beginning user testing.
### 6.4 User Testing
We carried out user testing to fully evaluate the robustness of our application. Actively engaging with potential users, we provided an activity sheet designed to guide them through all available functions, ensuring they explored each feature. After finishing the activities, users were urged to deliberately test the application's limitations by looking to identify possible problems or difficulties. After testers were satisfied they were provided with a survey form to share their feedback, allowing us to gather valuable insights for further enhancements to our application.

## 7. Installation Guide
