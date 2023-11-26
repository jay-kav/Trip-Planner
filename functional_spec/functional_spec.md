# Function Specification
## Table of contents
A table of contents with pages numbers indicated for all sections / headings should be included.

## 1. Introduction
### 1.1 Overview

#### Purpose and Function of the project:
The product is an online trip planner, providing a user-friendly platform for crafting itineraries, catering to the needs of frequent travelers. It targets time-pressed professionals who travel extensively for work and tourists seeking convenient scheduling in unfamiliar locations.

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
Describes the general functionality of the system / product.

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
Lists general constraints placed upon the design team, including speed requirements, industry protocols, hardware platforms, and so forth.

## 3. Functional Requirements
This section lists the functional requirements in ranked order. Functional requirements describes the possible effects of a software system, in other words, what the system must accomplish. Other kinds of requirements (such as interface requirements, performance requirements, or reliability requirements) describe how the system accomplishes its functional requirements.
As an example, each functional requirement could be specified in a format similar to the following:

Description - A full description of the requirement.
Criticality - Describes how essential this requirement is to the overall system.
Technical issues - Describes any design or implementation issues involved in satisfying this requirement.
Dependencies with other requirements - Describes interactions with other requirements.
Others as appropriate
## 4. System Architecture
This section describes a high-level overview of the anticipated system architecture showing the distribution functions across (potential) system modules. Architectural components that are reused or 3rd party should be highlighted.
## 5. High-Level Design
This section should set out the high-level design of the system. It should include one or more system models showing the relationship between system components and the systems and its environment. These might be object-models, DFD, etc.
## 6. Preliminary Schedule
This section provides an initial version of the project plan, including the major tasks to be accomplished, their interdependencies, and their tentative start/stop dates. The plan also includes information on hardware, software, and wetware resource requirements.
The project plan should be accompanied by one or more PERT or GANTT charts.

## 7. Appendices
Specifies other useful information for understanding the requirements. 
 
