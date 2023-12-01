# Function Specification
## Table of contents
A table of contents with pages numbers indicated for all sections / headings should be included.

## 1. Introduction
### 1.1 Overview

#### Purpose and Function of the project:
The application is an online trip planner, providing a user-friendly platform for crafting itineraries, catering to the needs of frequent travelers. It targets time-pressed professionals who travel extensively for work and tourists seeking convenient scheduling in unfamiliar locations.

To utilize the system, users must create an account. The system requires location, date, time, and travel distance information to generate an itinerary. Upon successful input, the user will be presented with three distinct itineraries to choose from.

#### Additional features:

Users can create group trip itineraries and invite others to view. The group creator assumes the role of group lead, maintaining control over the itineraries. Additionally, users can apply filters to their inputs, specifying preferred and disliked activity categories.

#### Collaborations:
- **Google API Integration:**  
The system leverages Google's API to gather comprehensive information about specified locations and define various activity categories crucial for itinerary generation.

- **Database Compatibility:**  
The system seamlessly integrates with either MongoDB databases. It stores extensive information obtained from Google's API, facilitating efficient storage and geolocation data querying associated with a diverse range of activities, thereby enhancing itinerary precision.

### 1.2 Business Context

This is the possible business context of our project once deployed 

#### Revenue Model

This project is a stand-alone program whose main goal is to offer an online trip planner that is easy to use. The primary component of the revenue strategy is advertisement, which is intended to be monetized through sponsored internal adverts that users encounter when creating itineraries. 


#### Growth and Potential Integration

Although direct selling of the product is not the primary goal at this point, corporate acquisitions or partnerships are still possibilities. Businesses seeking to expand their range of offers may choose to discuss incorporating this trip-planning system into their current products, which might result in an acquisition or collaborative partnership.


### 1.3 Glossary

- **API:**  
Stands for Application Programming Interface. In the context of this document, it refers to a set of rules, protocols, and tools that allow different software applications to communicate and interact with each other.

- **Itinerary:**  
An itinerary refers to a detailed plan or schedule of activities, events, or places to be visited during a trip or journey.

- **Travel Distance:**  
For the purpose of this project, "travel distance" specifically denotes the distance calculated for walking purposes. It refers to the distance that a person could walk between locations.

- **DB:**  
Used in this document as short hand for Database.


## 2. General Description
### 2.1 Product / System Functions

The system offers an array of functions aimed at providing users with comprehensive itinerary planning capabilities, facilitating easy and efficient trip organization:

#### Itinerary Generation:
   - Users can input trip details such as location, date, time, and preferred activities into a user-friendly form on the platform's homepage.
   - Upon submitting this information, the system generates three distinct itineraries tailored to the user's preferences, aiding in decision-making for daily schedules.

#### User Account Management:
   - Registration and login functionality enable users to create accounts, manage personal details, and access their itineraries securely.
   - Registered users gain access to personalized itinerary management, allowing the creation, viewing, and deletion of itineraries.

#### Collaborative Group Planning:
   - Users interested in planning group trips can create collaborative itineraries and invite other members via a seamless 'add member' functionality.
   - Group leaders possess exclusive rights to manage membership and itinerary modifications, ensuring coordination among multiple travelers.

#### Intuitive Interface and Navigation:
   - The system prioritizes ease of use and accessibility, featuring an intuitive interface suitable for users with varying levels of technical expertise.
   - Navigation elements, such as a navbar and interactive icons, simplify actions like viewing itineraries, adding or removing members, and logging out.

With the addition of these features, the system hopes to meet the various demands of frequent travelers, those seeking to enjoy a user-friendly and effective itinerary planning experience, and those interested in group travel planning.

### 2.2 User Characteristics and Objectives

#### User Characteristics:

- **Accessibility:**  
The system will be hosted online, ensuring accessibility for anyone with a computer and an internet connection, catering to a broad user base.

- **Targeted Audience:**  
People in the age range of 18 to 40, incorporating both male and female users, comprise the targeted demographic. It is assumed that people in this age range travel frequently and are accustomed to using internet interfaces.

- **Group Holiday Planners:**  
Additionally, the system aims to attract users interested in planning group holidays, accommodating their need for collaborative itinerary creation and coordination among multiple passengers.


#### User Objectives and Requirements:

- **User-Friendly Interface:**  
The primary objective is to provide an intuitive and user-friendly interface to accommodate users with varying levels of internet proficiency. Although some consumers may already be familiar with online technologies, the system design will not assume prior expertise, ensuring usability for all.

- **Targeted User Profile:**  
The ideal user profile consists of individuals who travel frequently, including those exploring new destinations regularly and those interested in planning group holidays. The system aims to cater to both individual and collaborative itinerary planning needs.

#### System Goals:

- **Ease of Use:**  
We prioritize making the system as user-friendly as possible in order to accommodate users with varying levels of technical proficiency and facilitate smooth interaction and navigation.

- **Accessibility and Appeal:**  
The system aims to be user-friendly and inclusive, drawing in users who may not be very familiar with the Internet but are interested in efficient travel scheduling. Apart from serving solo travelers, the online platform also helps group vacation planners by offering sharing functionalities.

### 2.3 Operational Scenarios

This section presents a series of scenarios illustrating user interactions and experiences within the system:

#### Unregistered User:

- An unregistered user browsing for solutions will visit the landing page and encounter prompts to either sign up or log in.
- Signing up leads them to a form where they can add their email, create a username, and set a password, adding their details to the Django database.

#### Registered User Login:

- Registered users, upon entering correct credentials, gain access to the system. Incorrect login attempts prompt an error message to re-enter the details.

#### Creating an Itinerary:

- On the homepage, the user will be prompted with a form to enter in the information regarding their trip. Not all boxes will be required to be filled out only the ones with a ‘*’ present. Once the necessary fields have been filled in the user will click the generate button and be prompted with three itineraries to choose from. The user will be able to name the itinerary.

#### Adding Members:

-  On a created itinerary there will be a ‘+’ symbol reading add member. The user will then be given a form below the symbol to enter the member's username to invite them to see the itinerary.

#### Removing Members:
- Removing members involves hovering over a member's name, triggering a delete option. Confirmation is required for this action via a message pop up. If done on a group itinerary only the group leaders hold exclusive removal rights.

#### Leaving Groups:
- A members wishing to leave a group involves hovering over the leave button, triggering a delete option. Confirmation is required for this action via a message pop up.

#### Viewing Existing Itineraries:

- Users can access their created itineraries through a navbar option. once clicked they will be redirected to a page where they can see the listings of all their created itineraries.

#### Deleting Itineraries:
- Deleting an itinerary involves hovering over it, clicking a delete icon, and confirming the deletion. For group trips Group leaders' deletions affect all members; otherwise, only the individual's access is removed.

#### Logging Out:

- Users can log out by clicking their profile icon, triggering a pop-up displaying account information and featuring a logout button at the bottom.

 

### 2.4 Constraints

This section outlines the constraints that the development team will encounter during the project:

#### Time Constraints

The project's deadline set at the end of February 2024 imposes a tight schedule for implementation, testing, and feedback integration. This limited timeframe necessitates efficient task prioritization and may affect the depth of testing and iteration cycles.

#### Ethical Approval

While obtaining ethical approval isn't a constraint in itself, the time required to secure this approval is a critical factor. A delay in receiving approval could make it more difficult to start user testing, which would affect project deadlines and milestones.

#### Meeting User Requirements

There is a question about the full satisfaction of user needs in light of the shortened testing period. Ensuring all user needs are met and addressing potential issues within this restricted period poses a challenge.

#### Financial Constraints

As a student project, financial constraints limit full access to the Google API. Access is restricted to acquiring essential data for only one to two locations for system testing purposes. This limitation may affect the breadth of functionalities tested and the comprehensiveness of data integration.

## 3. Functional Requirements
### 3.1 Sign Up/Register
- **Description:** Upon a users first visit to the site the will be prompted to register an account. The user will be asked to enter their first name, lastname, email and create a password to associate with their account. The user will then gain access to the site.
- **Criticality:** This step is essential if the user would like to save trips that they create and associate the trip with themselves and other group members. This will ensure of the collaborative aspect of the application.
- **Technical Issues:** The registration form itself will be designed in HTML and will fit in with the overall site layout. We will handle the form inputs themselves using JavaScript functions, which will create a new User object in thr MYSQL database inside of the Django backend.
- **Dependencies:** None
### 3.2 Log In
- **Description:** This function prompts the user to enter an email and password. If the information entered matches information that is associated with a registered user then the user is granted access to the site.
- **Criticality:** This user is critical to the application as the user must be logged in to save and access information regarding their planned trips.
- **Technical Issues:** This will require some security measures to be put in place so that user information is safe and there is no unauthorized access to the site.
- **Dependencies:** Depends on registration of user.
### 3.3 Create New Trip
- **Description:** The user is able to create new trips, by providing a location and times so that the applicatio can generate an itinerary for them. There are a number of filter available so that the user can customize the itinerary they receive.
- **Criticality:** This is one of the primary function of the application, meaning it hold great importance.
- **Technical Issues:** This feature will require us to write a somewhat complicated algorithm to generate the itinerary using the information pulled from the API.
- **Dependencies:** Depends on the user being registered and logged in.
### 3.4 Add Members To Trip
- **Description:** This allows users to share their itinerary with other users.
- **Criticality:** While this feature is not necessary for solo travelers, it can come in handy for groups of users travelling together.
- **Technical Issues:** Trips will need the feature of associating them with multiple users.
- **Dependencies:** This is dependant on a user being registered, logged in and having created a trip.
### 3.5 Remove Members From Trip
- **Description:** This allows the trip leader to remove other users from the trip.
- **Criticality:** This user is only required in the scenario that someone needs to be remove from the trip.
- **Technical Issues:** Overwriting a trip members data in database.
- **Dependencies:** User being registered and logged in, and a trip being created and a user being a member of the trip.
### 3.6 View Ongoing Trips
- **Description:** This is a simple screen displaying the ongoing trips of a user. The users will have the option to select a specific trip to view it in more detail.
- **Criticality:** This is an important feature as it will allow users to view the itinerary that has been generated for them throughout the day. It will also allow the user to make minors changes such as adding additional group members.
- **Technical Issues:** None.
- **Dependencies:** This is dependant on a user being registered, logged in and having created a trip or being invited to a trip.
### 3.7 View Past Trips
- **Description:** This will allow users to view trips that they have been on in the past. This can be useful if a user is returning to an area they have been to in the past.
- **Criticality:** This feature is more of a 'nice to have' and is not critical to the functionality of the application.
- **Technical Issues:** None.
- **Dependencies:** This is dependant on a user being registered, logged in and having created a trip or being invited to a trip.
### 3.8 Leave Trip
- **Description:** This will allow users to leave a trip that they are a member of.
- **Criticality:** This feature is equivalent to the remove group members function. Is only required in scenario that a member wants to leave the trip.
- **Technical Issues:** Overwriting a trip members data in database.
- **Dependencies:** This is dependant on a user being registered, logged in and having created a trip or being invited to a trip.
### 3.9 Delete Trip
- **Description:** This will allow users to delete a previously made trip.
- **Criticality:** This feature is more of a 'nice to have' and is not critical to the functionality of the application.
- **Technical Issues:** None.
- **Dependencies:** This is dependant on a user being registered, logged in and having created a trip or being invited to a trip.
### 3.10 Log Out
- **Description:** Allow users to log out out of their account to ensure greater security of their account.
- **Criticality:** This feature is important for user account security.
- **Technical Issues:** None.
- **Dependencies:** This is dependant on a user being registered and logged in.
## 4. System Architecture
### 4.1 System Architecture Diagram
![System Architecture Diagram](/functional_spec/images/SystemArchitictureDiagram.png)\
**Fig 4.1** above illustrates the architecture of the product. As the above diagram shows there are five main sections to the architecture. The first is the website (Front end. What the users see. Built using JavaScript/React). The website communicates with a Django server (which queries the local MySQL database and the MongoDB database).
### 4.2 Web Site
The front end of this website is what the user will see and engage with in order to access the applications other functions. This will be the least technical component of the product because its main purpose is to allow users to interact with the website's features in a visually appealing manner. This will guarantee that the Django server will handle the majority of the workload.
### 4.3 Django Server
The Django server will do most of the heavy lifting of the application stack. It communicates with both databases as well as the front end React app. The Django application takes care of the itinerary generation along with all other functionalities of the system.
### 4.4 MySQL Database
The MySQL Database is integrated with the Django server. This is used to store user information, and trip data.
### 4.5 MongoDB Database
The MongoDB database is where we will store the data that we pulled from Google Maps API for 1 or 2 major cities. This will communicate solely with Django server.
### 4.6 Google API
For the purposes of the this project we will do a once off pull of information from Google Maps API and store in MongoDB database. However, for a production model, we will do a direct pull from Google Maps API, upon each request.
## 5. High-Level Design
### 5.1 Data Flow Diagram
![Data Flow Diagram](/functional_spec/images/DataFlowDiagram.png)\
**Fig 5.1**

### 5.2 Data Flow Description
The Data Flow Diagram is used to provide the data movements of the system and show the functionality of
the system. We supply the process of the system, its external entities (Users) ,the flow of data
between these process and the data stores. 

As a brief overview of some scenarios the user sends an interation to the Django website thus creating different processes. Some being creating an itinerary by fetching data from the MongoBd then creating the Itineraty on the site and storing it in the Django DB or Adding another user to view the Itinerary by fetching the itinerary and the users ID from the Django DB and granting them access to view.

### 5.3 Sequence Diagram
![High-Level Design Diagram](/functional_spec/images/HighLevelDesignDiagram.png)\
**Fig 5.3**
### 5.4 Sequence Diagram Description
**Fig 5.3** is explained below.

- **Step 1 - Register/Sign Up:**  
Provide a first name, last name, email and password to create an account.

- **Step 2 - Log In:**  
Log into your account by entering the email and password associated with the account.

- **Step 3 - Create New Trip:**  
Users will provide various information such as location, times and other filters to generate their desired itinerary.

- **Step 4 - Add/Remove Members From Trip:**  
Trip leader will be able to add additional members to the trip or remove existing members.

- **Step 5 - View Ongoing Trip:**  
Users can view information regarding the trip they are currently on.

- **Step 6 - View Past Trips:**  
Users can view information regarding any trips that they have been on in the past.

- **Step 7 - Log Out:**  
Once you have finished using the various features of the site, you can then log out.


## 6. Preliminary Schedule
### 6.1 Overview
In Figure 6.2, there is a comprehensive list of tasks, including task names, durations, start and finish dates, and the designated team members responsible for each task. Figure 6.3 illustrates the plan outlining when and how these tasks are slated for completion.
The task list chart/table details essential information, presenting a clear overview of task specifics and team assignments. Meanwhile, the Gantt chart offers a visual representation of the same data, using bars or lines to depict each task and its interdependencies with preceding tasks. For instance, the completion of task A may or may not be a prerequisite for the commencement of task B, illustrating the sequential relationships within the project.
### 6.2 Task listings
|Task Name|Duration|Start|Finish|
|---|---|---|---|
|Project Proposal|7 days|06/10/23|13/10/23|
|Functional Spec|14 days|16/11/23|01/12/23|
|Set Up Project Infastructure|15 days|20/11/23|05/12/23|
|User Login and Out Functionality|4 days|03/12/23|07/12/23|
|Pull from Google API add to Mongo BD|3 days|03/12/23|06/12/23|
|Get Ethical Approval|TBC|TBC|TBC|
|Design Object Classes|2 days|19/01/24|21/01/24|
|Create Models|3 days|21/01/24|24/01/24|
|Set Up Rest Framework|10 days|24/01/24|04/02/24|
|Create Itinerary Function Implementation|14 days|24/01/24|07/02/24|
|View created Itinerarys Function|7 days|31/01/24|07/02/24|
|Delete Itineraries Function|7 days|31/01/24|07/02/24|
|Add & Remove Members Functions|7 days|31/01/24|07/02/24|
|Leave Itineraries Function|7 days|31/01/24|07/02/24|
|Basic UI Implementation|6 days|01/2/24|07/02/24|
|Full UI Implementation|7 days|05/02/24|12/02/24|
|User testing|12 days|09/02/24|21/02/24|
|Deploy Application|1 day|09/02/24|09/02/24|
|Write User manual|12 days|11/02/24|23/02/24|
|Technical Specification|12 days|11/02/24|23/02/24|
|Video Walk Through|3 days|20/02/24|23/02/24|


**Fig 6.2**
### 6.3 Gannt Chart
![Gantt Diagram](/functional_spec/images/Trip_Planner.png)\
**Fig 6.3**

## 7. Appendices
- Similar Sites
  - [Trip Planner AI](https://tripplanner.ai/) 
  - [Kayak](https://www.kayak.ie/trips)
  - [Wanderlog](https://wanderlog.com/)
- Research Tools
  - [w3schools](https://www.w3schools.com/)
  - [Google API Doc](https://developers.google.com/docs/api/reference/rest)
  - [SQL Course](https://www.sqlcourse.com/)
  - [Mongo DB](https://www.mongodb.com/docs/)
  - [Django Doc](https://docs.djangoproject.com/en/4.2/)
  - [React Doc](https://legacy.reactjs.org/docs/getting-started.html)
  - [Javascript Doc](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
## 8. References
