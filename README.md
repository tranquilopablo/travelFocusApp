
# Introduction to travelFocusApp

## Demo
[Live demo](https://travel-focus-app.web.app/)

## Credentials

- zgudapawel@gmail.com
- qwerty12

## Description

A fullstack application written in React that allows logged in users to add places to a user list places to visit and mark them as completed. The place, which includes a photo, can be fully edited or deleted. In addition, the app has Google maps implemented with location, so we are able to quickly see where where place is located. Each place can be set to be visible to the public or as a private place. The user has the option to delete or edit the profile, including the avatar. App uses a token for authentication, which is stored in localStorage.

## Form
The form on the frontend is validated without the use third party form validators. On the server i used express-validator middleware. 

## 🛠 Tech Stack

**Client:** React, CSS Modules, React Context, Firebase, React Transition Group

**Server:** Node, Express,MongoDb, AWS S3 

## Lessons Learned
The project allowed me to gain practice in application state management using the Context API. After writing a custom hook to fetch data,  first time i used AbortController to interrupt asynchronous queries. The challenge was implementing google maps so that each place would have its coordinates stored after the given address. Also writing the server itself was another practice, along with writing schemas in mongoose and linking the user model to the place model to be able, for example, when a user is deleted, his place objects also must to be deleted from the database. Again, as this was the first time i had to deal with AWS S3 bucket service for images, given that the documentation itself is not the most pleasant, there were also difficulties with the correct implementation here. solved most of the problems by searching for information on the Internet, mainly stack overflow and from the documentation.
