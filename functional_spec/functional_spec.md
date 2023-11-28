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

- **Google API Integration:** The system leverages Google's API to gather comprehensive information about specified locations and define various activity categories crucial for itinerary generation.

- **Database Compatibility:** The system seamlessly integrates with either PostgreSQL or MongoDB databases. It stores extensive information obtained from Google's API, facilitating efficient storage and geolocation data querying associated with a diverse range of activities, thereby enhancing itinerary precision.


### 1.2 Business Context

This is the possible business context of our project once deployed 

#### Revenue Model

This project is a stand-alone program whose main goal is to offer an online trip planner that is easy to use. The primary component of the revenue strategy is advertisement, which is intended to be monetized through sponsored internal adverts that users encounter when creating itineraries. 

**Tiered Access Model:**

- **Free Tier:** Users will have access to all functionalities detailed in this document. However, they may encounter internal advertisements during itinerary generation.
  
- **Paid Tier:** In the paid tier, users will be exempt from internal advertisements. Future additional functionalities, exclusive to the paid tier, might be introduced to enhance the system's capabilities.

#### Growth and Potential Integration

Although direct selling of the product is not the primary goal at this point, corporate acquisitions or partnerships are still possibilities. Businesses seeking to expand their range of offers may choose to discuss incorporating this trip-planning system into their current products, which might result in an acquisition or collaborative partnership.


### 1.3 Glossary

- **API:**  
Stands for Application Programming Interface. In the context of this document, it refers to a set of rules, protocols, and tools that allow different software applications to communicate and interact with each other.

- **Itinerary:**  
An itinerary refers to a detailed plan or schedule of activities, events, or places to be visited during a trip or journey.

- **Travel Distance:**  
For the purpose of this project, "travel distance" specifically denotes the distance calculated for walking purposes. It refers to the distance that a person could walk between locations.

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

- **Accessibility:** The system will be hosted online, ensuring accessibility for anyone with a computer and an internet connection, catering to a broad user base.

- **Targeted Audience:** People in the age range of 18 to 40, incorporating both male and female users, comprise the targeted demographic. It is assumed that people in this age range travel frequently and are accustomed to using internet interfaces.

- **Group Holiday Planners:** Additionally, the system aims to attract users interested in planning group holidays, accommodating their need for collaborative itinerary creation and coordination among multiple passengers.

#### User Objectives and Requirements:

- **User-Friendly Interface:** The primary objective is to provide an intuitive and user-friendly interface to accommodate users with varying levels of internet proficiency. Although some consumers may already be familiar with online technologies, the system design will not assume prior expertise, ensuring usability for all.

- **Targeted User Profile:** The ideal user profile consists of individuals who travel frequently, including those exploring new destinations regularly and those interested in planning group holidays. The system aims to cater to both individual and collaborative itinerary planning needs.

#### System Goals:

- **Ease of Use:** We prioritize making the system as user-friendly as possible in order to accommodate users with varying levels of technical proficiency and facilitate smooth interaction and navigation.

- **Accessibility and Appeal:** The system aims to be user-friendly and inclusive, drawing in users who may not be very familiar with the Internet but are interested in efficient travel scheduling. Apart from serving solo travelers, the online platform also helps group vacation planners by offering sharing functionalities.


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
### 4.2 Web Site
### 4.3 Django Server
### 4.4 MySQL Database
### 4.5 MongoDB Database
### 4.6 Google API
## 5. High-Level Design
This section should set out the high-level design of the system. It should include one or more system models showing the relationship between system components and the systems and its environment. These might be object-models, DFD, etc.
## 6. Preliminary Schedule
This section provides an initial version of the project plan, including the major tasks to be accomplished, their interdependencies, and their tentative start/stop dates. The plan also includes information on hardware, software, and wetware resource requirements.
The project plan should be accompanied by one or more PERT or GANTT charts.

## 7. Appendices
Specifies other useful information for understanding the requirements. 
 
