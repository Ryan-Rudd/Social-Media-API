# AthleteUnseen API Documentation

## Project Overview

The **AthleteUnseen** API is a social media platform tailored specifically for athletes, allowing them to showcase their talents, manage their stats, and connect with teams, scouts, and fans. This API is designed with a modular and scalable architecture, ensuring that the platform can grow and evolve to meet the needs of its users.

## Folder Structure

The project is organized into several key directories, each serving a specific purpose:

### `/src`
The root source directory where all application code resides.

### `/src/config`
Configuration files for the application.

- **`db.js`**: Handles database connection and setup.
- **`passport.js`**: Configures Passport.js for authentication and user session management.
- **`index.js`**: General application configuration settings, such as environment variables.

### `/src/controllers`
Controllers contain the logic for handling API requests and responses.

- **`authController.js`**: Manages user authentication, including registration, login, and logout.
- **`userController.js`**: Handles user profile management, including updating profiles, following/unfollowing users, and managing preferences.
- **`postController.js`**: Manages the creation, editing, deletion, and retrieval of user posts.
- **`commentController.js`**: Handles operations related to comments on posts, including adding, editing, and deleting comments.
- **`mediaController.js`**: Manages the upload, retrieval, and management of media files (images, videos).
- **`athleteController.js`**: Handles athlete-specific features such as managing statistics, showcases, and achievements.
- **`teamController.js`**: Manages team-related features, including creating teams, managing rosters, and viewing team details.
- **`eventController.js`**: Handles the creation and management of events like games, showcases, and tryouts.
- **`messageController.js`**: Manages direct and group messaging between users.
- **`notificationController.js`**: Handles user notifications and push notifications.
- **`searchController.js`**: Manages search functionality across users, posts, and teams.
- **`analyticsController.js`**: Provides endpoints for tracking and retrieving analytics data.
- **`adminController.js`**: Handles admin-specific operations like user management, content moderation, and analytics dashboards.
- **`integrationController.js`**: Manages third-party integrations such as social media sharing and external services.
- **`securityController.js`**: Handles security-related tasks like two-factor authentication and activity logging.
- **`monetizationController.js`**: Manages monetization features like ads, subscriptions, and merchandise sales.
- **`miscController.js`**: Handles miscellaneous features such as API documentation and legal information.

### `/src/models`
Models define the structure of the data stored in the database.

- **`User.js`**: Schema for user data including profile details, authentication credentials, and social connections.
- **`Post.js`**: Schema for posts created by users, including content, media, and engagement metrics.
- **`Comment.js`**: Schema for comments on posts, linking them to users and posts.
- **`Media.js`**: Schema for media files uploaded by users, such as images and videos.
- **`Athlete.js`**: Schema for athlete-specific data like statistics, achievements, and showcases.
- **`Team.js`**: Schema for teams, including team details and rosters.
- **`Event.js`**: Schema for events, including details, participants, and RSVPs.
- **`Message.js`**: Schema for direct and group messages between users.
- **`Notification.js`**: Schema for user notifications.
- **`Analytics.js`**: Schema for tracking and storing analytics data.
- **`Admin.js`**: Schema for admin-specific data and operations.
- **`Integration.js`**: Schema for third-party integrations and connected services.
- **`Security.js`**: Schema for security-related data, such as encryption keys and activity logs.
- **`Monetization.js`**: Schema for monetization features like subscriptions and ad placements.

### `/src/routes`
Routes map HTTP requests to the appropriate controller methods.

- **`authRoutes.js`**: Defines routes for authentication-related endpoints (e.g., `/login`, `/register`).
- **`userRoutes.js`**: Defines routes for user management endpoints (e.g., `/users/:userId`).
- **`postRoutes.js`**: Defines routes for post-related endpoints (e.g., `/posts`, `/posts/:postId`).
- **`commentRoutes.js`**: Defines routes for comment-related endpoints (e.g., `/posts/:postId/comments`).
- **`mediaRoutes.js`**: Defines routes for media management endpoints (e.g., `/media/upload`).
- **`athleteRoutes.js`**: Defines routes for athlete-specific features (e.g., `/athletes/:athleteId/stats`).
- **`teamRoutes.js`**: Defines routes for team management endpoints (e.g., `/teams`, `/teams/:teamId`).
- **`eventRoutes.js`**: Defines routes for event management endpoints (e.g., `/events`, `/events/:eventId`).
- **`messageRoutes.js`**: Defines routes for messaging endpoints (e.g., `/messages`, `/messages/:conversationId`).
- **`notificationRoutes.js`**: Defines routes for notification management (e.g., `/notifications`).
- **`searchRoutes.js`**: Defines routes for search functionality (e.g., `/search/users`, `/search/posts`).
- **`analyticsRoutes.js`**: Defines routes for analytics endpoints (e.g., `/analytics`, `/analytics/posts/:postId`).
- **`adminRoutes.js`**: Defines routes for admin-specific endpoints (e.g., `/admin/users`, `/admin/reports`).
- **`integrationRoutes.js`**: Defines routes for third-party integrations (e.g., `/integrations`, `/integrations/social-sharing`).
- **`securityRoutes.js`**: Defines routes for security-related endpoints (e.g., `/security/2fa`, `/security/logs`).
- **`monetizationRoutes.js`**: Defines routes for monetization features (e.g., `/monetization/ads`, `/monetization/subscriptions`).
- **`miscRoutes.js`**: Defines miscellaneous routes (e.g., `/docs`, `/terms`).

### `/src/middleware`
Middleware functions are executed before the final route handler and are used for tasks like authentication, validation, and error handling.

- **`authMiddleware.js`**: Ensures that routes requiring authentication are protected.
- **`errorMiddleware.js`**: Handles errors that occur during request processing.
- **`validationMiddleware.js`**: Validates incoming data to ensure it meets the required format.
- **`rateLimitMiddleware.js`**: Prevents abuse by limiting the number of requests a client can make in a given time period.

### `/src/services`
Services contain business logic that is reusable across multiple controllers.

- **`emailService.js`**: Handles sending emails for things like verification, password resets, etc.
- **`paymentService.js`**: Integrates with payment gateways to process transactions.
- **`analyticsService.js`**: Provides methods for collecting and analyzing user data.
- **`fileUploadService.js`**: Handles file uploads and storage management.
- **`notificationService.js`**: Manages push notifications to users.
- **`cryptoService.js`**: Provides cryptographic utilities, such as encryption and hashing.

### `/src/utils`
Utility files contain helper functions and constants used throughout the application.

- **`helperFunctions.js`**: General-purpose utility functions used across the app.
- **`constants.js`**: Constants used across the application for consistency.
- **`logger.js`**: Utility for logging information, errors, and other messages.
- **`responseFormatter.js`**: Standardizes the format of API responses.

### `/src/tests`
Contains tests for various parts of the application, ensuring that everything functions correctly.

- **`/unit`**: Unit tests for individual modules and functions.
- **`/integration`**: Integration tests that ensure multiple parts of the system work together as expected.
- **`/controllers`**: Tests for each controller, ensuring that API logic is correct.
- **`/routes`**: Tests for each route, ensuring they correctly map to the controller logic.
- **`/services`**: Tests for the service layer, ensuring business logic is functioning properly.

### `/public`
Contains publicly accessible files, such as images, documents, or static content that might be served by the application.

### `/docs`
Documentation files for the project.

- **`swagger.yaml`**: Contains the API documentation written in the Swagger/OpenAPI format.
- **`README.md`**: This documentation file, providing an overview of the project and its structure.

### Root Files

- **`.env`**: Environment variables used for configuration (e.g., API keys, database URLs).
- **`.gitignore`**: Specifies which files and directories should be ignored by Git.
- **`package.json`**: Lists the project's dependencies and scripts for NPM.
- **`package-lock.json`**: Locks the versions of dependencies to ensure consistency across installations.
- **`README.md`**: Main project documentation (this file).
- **`LICENSE`**: The project's license information, specifying the terms under which the code can be used.

## Getting Started

1. **Install Dependencies**: Run `npm install` to install the necessary dependencies.
2. **Set Up Environment**: Create a `.env` file in the root directory and populate it with your configuration settings (refer to `src/config/index.js`).
3. **Run the Server**: Start the server using `npm start` or `node src/server.js`.
4. **API Documentation**: Access the API documentation at `/docs` or view the Swagger UI if it's set up.

## Contributing

If you'd like to contribute to this project, please fork the repository, create a new branch for your feature or bug fix, and submit a pull request. Be sure to write tests for any new functionality and ensure all tests pass before submitting.

## License

This project is licensed under the MIT License. See the [LICENSE](../LICENSE) file for more details.

---

Feel free to expand or modify this documentation as the project evolves.
