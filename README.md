# Task Manager

A task manager REST API complete with user accounts and authentication.

## Features
1. MongoDB to store user accounts as well as tasks.
2.  Validation to restrict what data can be stored in the database, and sanitization to store user data in a uniform and standardized way.
3. Authentication: requires users to log in before they’ll be able to manage their tasks. Covers password security, Express middleware. 
4. Securely store user passwords by hashing and salting the password before storing it in the database.
5. Middleware to automatically hash a user’s password before the user is saved to the database.
6.  Authentication token so that the client doesn’t need to log in every time they want to perform an operation on the server.
7. Advanced techniques for fetching data. This includes sorting, filtering, and pagination. 
8. Users can upload documents, profile pictures, and any other file type.
9. Email sending to communicate with users as they use the app. This could be useful for welcome emails,
notifications, and more!
10. Testing using the JEST automatied test suite. 

## Tech Stack

 - Node.js
 - Express.js
 - MongoDB

## Run

In the project directory, you can run:
### `npm install`

### `npm run dev`

Once the server is up and running, users will be able to interact with the application via [Postman](https://www.postman.com/).
