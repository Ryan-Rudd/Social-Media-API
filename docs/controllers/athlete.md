# Athlete Controller Documentation

The `athleteController.js` handles all the operations related to creating, retrieving, updating, and deleting an athlete profile. Each user can create an athlete profile, which is linked to their user document. The controller allows the user to manage their own athlete profile dynamically by providing flexible stats and athlete information.

## Overview

- **Create Athlete Profile**: This route allows users to create a new athlete profile. The user's name is automatically included in the athlete profile, and any other key-value pairs provided in the request body are stored as stats. Once an athlete profile is created, it is linked to the user's document in the database.
  
- **Get Athlete Profile**: This route retrieves the athlete profile linked to the authenticated user. If the user has created an athlete profile, it will be returned. If no profile exists, an error is returned.

- **Update Athlete Profile**: This route allows the user to update the athlete profile linked to their account. Any key-value pairs provided in the request body are used to update the athlete profile. Only the authenticated user linked to the profile can perform updates.

- **Delete Athlete Profile**: This route deletes the athlete profile linked to the authenticated user and removes the reference to the athlete profile from the user's document. Once deleted, the profile is permanently removed from the database.

## Endpoints

1. **Create Athlete Profile**
   - **Description**: Creates a new athlete profile and links it to the user's document.
   - **Route**: `POST /api/v1/athletes`
   - **Access**: Authenticated users only.

2. **Get Athlete Profile**
   - **Description**: Retrieves the athlete profile linked to the authenticated user.
   - **Route**: `GET /api/v1/athletes`
   - **Access**: Authenticated users only.

3. **Update Athlete Profile**
   - **Description**: Updates the athlete profile linked to the authenticated user.
   - **Route**: `PUT /api/v1/athletes`
   - **Access**: Authenticated users only.

4. **Delete Athlete Profile**
   - **Description**: Deletes the athlete profile linked to the authenticated user and removes the reference in the user's document.
   - **Route**: `DELETE /api/v1/athletes`
   - **Access**: Authenticated users only.

## Error Handling

- **404 User Not Found**: If the user attempting to create, retrieve, update, or delete the athlete profile does not exist in the database, a `404` error is returned with the message "User not found."

- **400 Athlete Profile Already Exists**: When attempting to create an athlete profile, if the user already has a profile linked to their account, a `400` error is returned with the message "User already has an athlete profile."

- **404 Athlete Profile Not Found**: If a user attempts to retrieve, update, or delete an athlete profile that does not exist, a `404` error is returned with the message "Athlete profile not found."

- **500 Server Error**: In the event of any server issues or unexpected failures, a `500` error is returned with the message "Server Error" along with the specific error details for debugging purposes.

## Notes

- **Authentication Required**: All operations related to athlete profiles are protected by authentication. Users must be authenticated to create, retrieve, update, or delete an athlete profile.
  
- **Flexible Stats**: When creating or updating an athlete profile, the user can provide any key-value pairs as part of the stats object. This allows for flexible athlete profile creation without predefined fields.

- **Database Linkage**: Each athlete profile is linked directly to a user document in the database. If a user deletes their athlete profile, the reference is removed from their document, and the profile is permanently deleted from the database.
