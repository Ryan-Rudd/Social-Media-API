# User Controller Documentation

This documentation covers the functionality provided by the `userController.js` file, which manages various user-related operations such as retrieving and updating user profiles, following and unfollowing users, managing notifications, and updating user preferences. The recent updates ensure that these operations are secured, requiring proper authorization before any user information can be accessed or modified.

## Overview

The `userController.js` file contains methods that handle user-specific actions, including:
1. **Retrieving User Profiles**
2. **Updating User Profiles**
3. **Following/Unfollowing Users**
4. **Listing Followers and Following Users**
5. **Managing Notifications**
6. **Managing User Preferences**

### Security Updates

- **Authorization Checks**: Each method now includes checks to ensure that only the authenticated user (or an admin) can perform operations on their own data. Unauthorized attempts result in a `403 Forbidden` response.
- **Authentication Middleware**: All routes that interact with these controller methods should be protected by an authentication middleware that verifies the user's JWT and attaches the user information to the `req` object.
- **Error Handling**: Improved error handling has been added to provide clear and meaningful error messages, especially useful for mobile app clients.

## Functions

### 1. `getUserProfile(res, userId)`

#### Description
Retrieves the profile of a user by their ID. The response excludes sensitive information such as the password and session token.

#### Flow
- **Authorization Check**: The method checks if the user is authenticated by verifying the presence of `req.user`.
- **User Lookup**: The function finds the user by `userId` using the `User.findById` method.
- **Response**: If the user is found, the profile is returned with a success response. If not, an error response is sent.

#### Parameters
- `res` (*Object*): The response object used to send the HTTP response.
- `userId` (*string*): The ID of the user whose profile is being retrieved.

### 2. `updateUserProfile(req, res, userId, updates)`

#### Description
Updates a user's profile with the provided data. Input data is sanitized before updating the profile.

#### Flow
- **Authorization Check**: The method checks if the logged-in user (`req.user.id`) matches the `userId` or if the user has an admin role (`req.user.role === 'admin'`). Unauthorized access results in a `403 Forbidden` response.
- **Sanitization**: All updates are sanitized using `sanitizer.sanitize`.
- **Profile Update**: The user's profile is updated using `User.findByIdAndUpdate`.
- **Response**: The updated profile is returned with a success response, excluding sensitive information. If the user is not found, an error response is sent.

#### Parameters
- `req` (*Object*): The request object containing user information.
- `res` (*Object*): The response object used to send the HTTP response.
- `userId` (*string*): The ID of the user whose profile is being updated.
- `updates` (*Object*): The updates to be applied to the user's profile.

### 3. `followUnfollowUser(req, res, userId, targetUserId)`

#### Description
Allows a user to follow or unfollow another user. The function updates the `following` list of the user and the `followers` list of the target user.

#### Flow
- **Authorization Check**: The method checks if the logged-in user (`req.user.id`) matches the `userId` or if the user has an admin role. Unauthorized access results in a `403 Forbidden` response.
- **User Lookup**: Both the user and the target user are found by their respective IDs.
- **Follow/Unfollow Logic**: If the user is already following the target user, they are unfollowed. Otherwise, they are added to each other's follower/following lists.
- **Response**: A success response is returned, indicating whether the operation was a follow or an unfollow. If either user is not found, an error response is sent.

#### Parameters
- `req` (*Object*): The request object containing user information.
- `res` (*Object*): The response object used to send the HTTP response.
- `userId` (*string*): The ID of the user who wants to follow/unfollow.
- `targetUserId` (*string*): The ID of the user to be followed/unfollowed.

### 4. `listFollowersFollowing(req, res, userId, listType)`

#### Description
Retrieves the list of users that either follow a specific user or are followed by the user, depending on the `listType` parameter.

#### Flow
- **Authorization Check**: The method checks if the logged-in user (`req.user.id`) matches the `userId` or if the user has an admin role. Unauthorized access results in a `403 Forbidden` response.
- **User Lookup**: The user is found by their `userId`, and the appropriate list (`followers` or `following`) is populated.
- **Response**: The list is returned with a success response. If the user is not found, an error response is sent.

#### Parameters
- `req` (*Object*): The request object containing user information.
- `res` (*Object*): The response object used to send the HTTP response.
- `userId` (*string*): The ID of the user whose followers/following are being listed.
- `listType` (*string*): Specifies whether to list `followers` or `following`.

### 5. `getNotifications(req, res, userId)`

#### Description
Retrieves the notifications for a specific user.

#### Flow
- **Authorization Check**: The method checks if the logged-in user (`req.user.id`) matches the `userId` or if the user has an admin role. Unauthorized access results in a `403 Forbidden` response.
- **User Lookup**: The user is found by their `userId`, and their notifications are populated.
- **Response**: The notifications are returned with a success response. If the user is not found, an error response is sent.

#### Parameters
- `req` (*Object*): The request object containing user information.
- `res` (*Object*): The response object used to send the HTTP response.
- `userId` (*string*): The ID of the user whose notifications are being retrieved.

### 6. `markNotifications(req, res, userId, notificationIds, isRead)`

#### Description
Marks specified notifications as read or unread for the user.

#### Flow
- **Authorization Check**: The method checks if the logged-in user (`req.user.id`) matches the `userId` or if the user has an admin role. Unauthorized access results in a `403 Forbidden` response.
- **User Lookup**: The user is found by their `userId`.
- **Marking Logic**: Each notification in the user's `notifications` array is checked against the `notificationIds`, and the `isRead` status is updated accordingly.
- **Response**: A success response is returned after updating the notifications. If the user is not found, an error response is sent.

#### Parameters
- `req` (*Object*): The request object containing user information.
- `res` (*Object*): The response object used to send the HTTP response.
- `userId` (*string*): The ID of the user whose notifications are being marked.
- `notificationIds` (*Array*): The IDs of the notifications to be marked.
- `isRead` (*boolean*): Whether to mark notifications as read or unread.

### 7. `manageUserPreferences(req, res, userId, preferences)`

#### Description
Updates the user's preferences with the provided data.

#### Flow
- **Authorization Check**: The method checks if the logged-in user (`req.user.id`) matches the `userId` or if the user has an admin role. Unauthorized access results in a `403 Forbidden` response.
- **Preferences Update**: The user's preferences are updated using `User.findByIdAndUpdate`.
- **Response**: The updated profile with the new preferences is returned with a success response. If the user is not found, an error response is sent.

#### Parameters
- `req` (*Object*): The request object containing user information.
- `res` (*Object*): The response object used to send the HTTP response.
- `userId` (*string*): The ID of the user whose preferences are being managed.
- `preferences` (*Object*): The preferences to be updated.

## Security Considerations

- **Input Sanitization**: All user inputs are sanitized using `sanitizer.sanitize` to prevent injection attacks.
- **Authorization Checks**: Each method verifies that the action is being performed by the user themselves or an admin. Unauthorized attempts result in a `403 Forbidden` response.
- **Error Handling**: Each method includes robust error handling and logging using the `logger` utility to ensure issues are properly logged and reported.

## Error Handling

- **Consistent Responses**: All errors are handled and returned using `responseFormatter.errorResponse()` to ensure consistency across the API.
- **Logging**: Errors and important actions are logged using the `logger` utility for debugging and monitoring purposes.

## Summary

The `userController.js` file provides a secure and robust set of methods for managing user-related operations in your social media application. By leveraging authorization checks, input sanitization, and structured error handling, the controller ensures that user data is handled securely and efficiently.
