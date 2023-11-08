# School of Computing CA326 Year 3 Project Proposal Form
### Project Title
Trip Planner Web Application
### Student 1
- **Name:** Ethan Kavanagh
- **ID Number:** 21344873 
### Student 2
- **Name:** Jamie Kavanagh
- **ID Number:** 21403382
### Staff Member Consulted
Michael Scriney 

## Project Description:
Our web application is designed to aid in planning activities for user when visiting unfamiliar cities/countries. Wether you're travelling solo or on a group holiday, this app takes away a massive part of the planning.
### Creating and Managing Trips
When logging into the app, users have the option to create a new trip from scratch or access their ongoing or past trips. When creating a new trip, users specify the destination and date along with a start and end time. The trip's creator is automatically assigned as the 'trip leader,' which gives them exclusive control to manually adjust the itinerary.
### Smart Itinerary Generation
After the user specifies their preferences (such as activities they do/don't want to do, or distance to travel), we will retrieve the relevant information stored in our PostgreSQL database. This data will be from a once-off Google Maps API request. Due to the limited timeframe for this project, we will assume users only form of transport is walking only (this is ideal for many European cities) as adding in public transport etc, would make the scope of the project too big.
We will use PostGIS (an extension of PostgreSQL), to store geographical information of activities, which will allow us to calculate distance/time between activities.
The API will provide activity imformation only. Our algorithm will construct potential daily itineraries, based on things to do, users preferences and the space/travel time between activities. The user will be given an option 2 or 3 different itineraries. The algorithm will attempt to give the user unique itineraries based on their preferences and previous days activities.
### Technology Stack
The web app will use Python, Django, and PostgreSQL for the backend. On the front end, we employ JavaScript, React, and CSS Frameworks to deliver a sleek and user-friendly interface. We will then use Docker and AWS to deploy the web app.
### Collaborative Travel Planning
Acknowledging that travel is often a shared experience, our app allows users to invite others to join their trip. This collaborative feature enables sharing of the itinerary, making group travel a breeze.

## Division of Work
### Ethan
- Weekly blog posts
- Algorithm Design
- Technical Specification 
- Creating functional requirements
- Deploy the app to the web using Docker and Azure/AWS
- Frontend Design of the web app (HTML/CSS)
- Finding and setting up appropriate APIs
- Final Presentation
### Jamie
- Algorithm Design
- Database to store profiles and associated trip information
- Finding and setting up appropriate APIs
- Creating functional requirements
- User Manual
- Technical Specification 
- Recording video walkthrough
- Weekly blog posts
- Final Presentation

## Programming languages
### Backend
- Python
- SQL
### Frontend
- JavaScript
- HTML
- CSS

## Programming tools
- VS Code
- Docker
- PostgreSQL
- Django (Backend)
- React (Frontend)

## Learning Challenges
- Finding a usable API to supply the data we need for the web app and upon finding an API, learning how to use it efficiently for a smooth user experience.
- Learn how to use React effectively as well as necessary CSS and component libraries.

## Hardware/software platform
Developed using WSL on a Windows PC. Runs on Linux but will be deployed as a web app using Docker. 

## Special hardware/software requirements
None
