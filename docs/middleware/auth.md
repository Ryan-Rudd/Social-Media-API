# Authentication Middleware Documentation

The `authMiddleware.js` file is responsible for securing routes by ensuring that only authenticated users can access certain endpoints. It does this by verifying JSON Web Tokens (JWT) provided by the client and attaching the authenticated user's details to the request object (`req`).

## Overview

This middleware checks for the presence of a valid JWT in the `Authorization` header of incoming requests. If the token is valid, it decodes the token, retrieves the user from the database, and attaches the user information to the `req` object. If the token is invalid or missing, the request is denied with an appropriate error response.

## How It Works

1. **Token Extraction**: The middleware extracts the JWT from the `Authorization` header, which is expected to be in the format `Bearer <token>`.
2. **Token Verification**: The token is verified using the secret key stored in environment variables (`process.env.JWT_SECRET`).
3. **User Lookup**: If the token is valid, the middleware decodes it to get the user ID, then retrieves the user from the database.
4. **Attach User to Request**: The user object (excluding sensitive fields like password and session token) is attached to the `req` object, allowing subsequent middleware and route handlers to access the authenticated user's information.
5. **Error Handling**: If the token is invalid or the user is not found, the middleware returns an error response, preventing access to protected routes.

### Parameters

- **req** (*Object*): The incoming request object. The middleware will modify this object by attaching the `user` object if authentication is successful.
- **res** (*Object*): The response object used to send an HTTP response.
- **next** (*Function*): The next middleware or route handler in the Express.js stack.

### Usage

Apply this middleware to any route that requires the user to be authenticated. The middleware ensures that only requests with a valid JWT can access protected routes.

### Error Handling

- **401 Unauthorized**: Returned if the token is missing or invalid, or if the user associated with the token cannot be found.
- **Error Message**: Provides a clear explanation of why the request was denied, useful for both developers and the client application.
