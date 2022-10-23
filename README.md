
# Introduction to travelFocusApp

## Demo
[Live demo](https://travel-focus-app.web.app/)

## Credentials

- zgudapawel@gmail.com
- qwerty12

## Description

A fullstack application written in React that allows users to add one place to a list to visit when logged in. The place, which includes a photo, can be fully edited or deleted. In addition, the app has Google maps implemented with location, so we are able to quickly see where where place is located. Each place can be set to be visible to the public or as a private place. It is also possible to deselect to a completed list, and once added to the list, the card is automatically updated. The user has the option to delete or edit the profile, including the avatar. Express.js is used as the backend, data is stored in MongoDb and images are hosted on AWS S3. App uses a token for authentication, which is stored in localStorage.

## Form
The form on the frontend is validated without the use third party form validators. On the server i used express-validator middleware. 

## Tech Stack

**Client:** React, CSS Modules, React Context, Firebase, React Transition Group

**Server:** Node, Express,MongoDb, AWS S3 
