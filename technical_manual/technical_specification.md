# Technical Specification
Table Of Contents

1. Introduction	2
1.1 Overview	2
1.2 Glossary	2
2. Research	3
2.1 Web App	3
2.1.1 Django	3
2.1.2 React	3
2.2 Databases	3
2.2.1 PostgreSQL	3
2.2.2 MongoDB Atlas	3
2.3 Algorithms	4

1. Introduction
1.1 Overview
This project is a web application that users can use to make plans for a trip. The users can share their created trips with others. The user registers or logs in to their account on the web application. This user's information is then saved to a cloud database. The user can then use the web application to view their saved trips and create new ones. The app will generate an itinerary (list of things to do) and associate it with your created trip. You can then view all itineraries, trip members and other information to do with the trip.
1.2 Glossary
Python - a beginner-friendly programming language known for its simplicity and readability, with a large community and extensive libraries for various tasks.
Javascript - JavaScript is a programming language primarily used for creating interactive and dynamic web content, enabling functionality like animations, forms validation, and interactive user interfaces on websites.
PostgreSQL - often referred to as Postgres, is a powerful open-source relational database management system used to store and manage structured data, supporting features like transactions, indexes, and complex queries.
Django - a high-level Python web framework that simplifies and speeds up the development of web applications by providing tools and libraries for handling common web development tasks.
React.js - a JavaScript library for building user interfaces, commonly used for creating dynamic and interactive web applications by efficiently managing the updating of components based on changes in data.
SQL - ‘Structured Query Language’ is a standard programming language used to manage and manipulate relational databases, allowing users to store, retrieve, update, and delete data from databases.
MongoDB - a popular NoSQL database that stores data in flexible, JSON-like documents, making it easy to handle and scale data for modern applications with diverse or rapidly changing data structures.
Material UI - a popular React component library that offers pre-designed and customizable user interface elements following Google's Material Design guidelines, making it easier for developers to create visually appealing and consistent web applications.
API - Application Programming Interface is a set of protocols and tools that allows different software applications to communicate and interact with one another. They facilitate data exchange and enable developers to access specific features or services without needing in-depth knowledge of the underlying systems.
2. Research
This section will give a brief overview of the research we conducted so that we would be adequately prepared to undertake the design and implementation of our project.
2.1 Web App
2.1.1 Django
Django is a framework for creating web applications using Python. It is the ideal way to build a solid backend for the app. This is because of its seamless integration with rest framework and Corsheaders to create secure applications. We have previous experience using Django for smaller assignments, but have never used it for a project of this scale. We had to do extensive research into the functionality of Django views, forms and serializers due to the very large functions that would need to be written for the itinerary generation.
2.1.2 React
We used React for the frontend of the application. We had to look into the various modules such as Axios for making requests, Routers for navigating between pages and Material UI for CSS, to integrate with our React application. This would allow us to create a seamless user experience.
2.2 Databases
2.2.1 PostgreSQL
By default Django uses SQLite3 for storing data. We discovered SQLite3 does not support an array type field, which is something we need for our models. We opted to use PostgreSQL for this reason. Use of PostgreSQL ArrayField in Django:
activities = ArrayField(models.CharField())
We had not used it before so we needed to research what was involved with the installation of the packages and set up a database. Then connect that database to our Django backend.
2.2.2 MongoDB Atlas
For our project we couldn’t afford to continuously query Google Places API so we needed to choose a database to store the information. MongoDB is a non-relational database that was chosen for its suitability in storing JSON documents and its support for geospatial querying, a feature we anticipated would greatly enhance our itinerary generator later on. Our exploration of MongoDB included mastering the setup of the database, creating collections, and designing the document structure within. Additionally, we delved into the process of connecting the database to our application using MongoDB drivers and PyMongo.
