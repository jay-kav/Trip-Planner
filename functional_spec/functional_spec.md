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

#### Sponsorship and Revenue Model

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
Describes the features of the user community, including their expected expertise with software systems and the application domain. Explain the objectives and requirements for the system from the user's perspective. It may include a "wish list" of desirable characteristics, along with more feasible solutions that are in line with the business objectives.

### 2.3 Operational Scenarios
This section should describe a set of scenarios that illustrate, from the user's perspective, what will be experienced when utilizing the system under various situations.
In the article Inquiry-Based Requirements Analysis (IEEE Software, March 1994), scenarios are defined as follows:
In the broad sense, a scenario is simply a proposed specific use of the system. More specifically, a scenario is a description of one or more end-to-end transactions involving the required system and its environment. Scenarios can be documented in different ways, depending up on the level of detail needed. The simplest form is a use case, which consists merely of a short description with a number attached. More detailed forms are called scripts. 

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
 
