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

    activities = ArrayField(models.CharField())

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




