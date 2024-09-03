# User Authentication Controller Documentation

This file (`authController.js`) manages user authentication, including user registration, login, and logout functionalities. It uses various utilities and libraries to ensure secure and effective handling of user data, focusing on operations like input validation, session management with JWT, and database interactions.

## Overview

The main tasks handled by this controller include:

1. **Registering Users**: Validates and stores user information in the database.
2. **Logging In Users**: Authenticates user credentials and generates a session token.
3. **Logging Out Users**: Removes the session token to log out the user.

## Dependencies

- **User**: The Mongoose model representing users in the database.
- **responseFormatter**: A utility for formatting API responses in a consistent manner.
- **database**: Configuration for connecting to MongoDB.
- **mongoose**: MongoDB object modeling tool used for interacting with the database.
- **pwValidate**: Utility for validating password strength.
- **usernameValidate**: Utility for validating username format and uniqueness.
- **sanitizer**: A library used to sanitize user input, preventing injection attacks.
- **jwt**: JSON Web Token library for creating and verifying JWTs.
- **bcrypt**: Library for hashing passwords and verifying password matches.
- **logger**: Custom logging utility for tracking actions and errors.
- **dotenv**: Loads environment variables from a `.env` file.

## Functions

### 1. `registerUser(res, name, username, password, email)`

#### Description
This function handles the registration of a new user. It sanitizes user inputs, validates the username and password, checks for the uniqueness of the username and email, and finally saves the new user to the database.

#### Flow
- **Sanitization**: Inputs are sanitized using `sanitizer.sanitize()` to prevent injection attacks.
- **Validation**: The username and password are validated using `usernameValidate` and `pwValidate` respectively.
- **Uniqueness Check**: The function checks if the username or email already exists in the database.
- **User Creation**: If all checks pass, a new `User` document is created and saved to the database.
- **Response**: A success or error response is sent back to the client using `responseFormatter`.

#### Parameters
- `res` (*Object*): The response object used to send the HTTP response.
- `name` (*string*): The name of the new user.
- `username` (*string*): The username for the new user.
- `password` (*string*): The password for the new user.
- `email` (*string*): The email address of the new user.

### 2. `loginUser(res, username, password)`

#### Description
This function handles user login by authenticating the user's credentials. Upon successful authentication, it generates a JWT token that is stored in the user's record as a session token.

#### Flow
- **Sanitization**: The username and password inputs are sanitized.
- **Database Query**: The function searches for the user by username in the database.
- **Password Matching**: The hashed password stored in the database is compared with the provided password using `bcrypt`.
- **JWT Generation**: If the password matches, a JWT token is generated with the user's ID and username as payload.
- **Session Management**: The generated JWT token is stored as `sessionToken` in the user's record to maintain the session.
- **Response**: The token is sent back to the client in the response for future authentication.

#### Parameters
- `res` (*Object*): The response object used to send the HTTP response.
- `username` (*string*): The username of the user trying to log in.
- `password` (*string*): The password of the user trying to log in.

#### Session Management with JWT
- **JWT**: JSON Web Token (JWT) is used to create a secure, stateless session for the user. The token includes the user ID and username, which can be verified by the server in subsequent requests to authenticate the user's session.
- **Storage**: The session token is stored in the `sessionToken` field of the user's document in MongoDB. This allows for easy session validation and management.
- **Security**: The token is signed using a secret key defined in the environment variables (`process.env.JWT_SECRET`), ensuring that the token cannot be tampered with.

### 3. `logoutUser(res, username)`

#### Description
This function handles the logout process by removing the session token from the user's record in the database.

#### Flow
- **Sanitization**: The username input is sanitized.
- **Database Query**: The function searches for the user by username in the database.
- **Session Removal**: The session token (`sessionToken`) is set to `null`, effectively logging the user out by invalidating their session.
- **Response**: A success response is sent back to the client indicating that the user has been logged out.

#### Parameters
- `res` (*Object*): The response object used to send the HTTP response.
- `username` (*string*): The username of the user who is logging out.

## Security Considerations

- **Input Sanitization**: All user inputs are sanitized to prevent SQL injection, XSS, and other common attacks.
- **Password Hashing**: Passwords are hashed using `bcrypt` before being stored in the database to ensure they are not stored in plain text.
- **JWT**: JWT is used to manage user sessions securely. The token is signed and can be verified to ensure authenticity.

## Error Handling

- **Consistent Responses**: All errors are handled and returned using `responseFormatter.errorResponse()` to ensure consistency across the API.
- **Logging**: Errors and important actions are logged using the `logger` utility for debugging and monitoring purposes.

## Environment Variables

- **JWT_SECRET**: A secret key used for signing JWTs, which must be stored securely in the `.env` file.

## Summary

This controller integrates various security measures and utilities to manage user authentication, including registration, login, and logout. JWT is used to handle sessions securely, and input validation ensures that user data is handled safely. The controller is designed to work efficiently with a MongoDB database, using Mongoose for data modeling and interactions.
