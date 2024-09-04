# Post Controller Documentation

The `postController.js` file is responsible for managing CRUD operations for posts in the social media application, including creating, editing, deleting, and retrieving posts. Additionally, it handles features like liking, commenting, and sharing posts, as well as deleting comments. The controller ensures input sanitization and authorization checks before any changes are made to posts or comments.

## Overview

This controller manages the following operations:
1. **Creating Posts**: Allows users to create new posts.
2. **Editing Posts**: Enables users to modify existing posts.
3. **Deleting Posts**: Allows users to delete their posts.
4. **Liking/Unliking Posts**: Manages the process of liking or unliking posts.
5. **Commenting on Posts**: Adds comments to posts.
6. **Deleting Comments**: Allows users to delete their comments from posts.
7. **Sharing Posts**: Enables users to share posts created by others.

## Functions

### 1. `createPost(req, res)`

#### Description
Creates a new post and associates it with the authenticated user.

#### Flow
- **Input Sanitization**: The `title` and `content` fields from the request body are sanitized to prevent injection attacks.
- **Post Creation**: A new `Post` document is created and saved in the database.
- **User Association**: The post ID is added to the authenticated user's `posts` array.
- **Response**: Returns a success response with the created post data.

#### Parameters
- `req` (*Object*): The request object containing post information and the authenticated user.
- `res` (*Object*): The response object used to send the HTTP response.

---

### 2. `editPost(req, res, postId)`

#### Description
Edits an existing post by updating its title and content.

#### Flow
- **Input Sanitization**: The `title` and `content` fields from the request body are sanitized.
- **Post Lookup**: The post is found using the `postId`.
- **Post Update**: The post's title and content are updated.
- **Response**: If successful, returns the updated post. If the post is not found, returns an error response.

#### Parameters
- `req` (*Object*): The request object containing updated post information.
- `res` (*Object*): The response object used to send the HTTP response.
- `postId` (*string*): The ID of the post to be updated.

---

### 3. `deletePost(res, postId)`

#### Description
Deletes a post by its ID.

#### Flow
- **Post Lookup**: The post is found using the `postId`.
- **Post Deletion**: The post is deleted from the database.
- **Response**: If successful, returns a success message. If the post is not found, returns an error response.

#### Parameters
- `res` (*Object*): The response object used to send the HTTP response.
- `postId` (*string*): The ID of the post to be deleted.

---

### 4. `likeUnlikePost(req, res, postId)`

#### Description
Likes or unlikes a post depending on the current state.

#### Flow
- **Post Lookup**: The post is found using the `postId`.
- **Like/Unlike Logic**: If the post is already liked by the user, the like is removed. If not, the like is added.
- **Response**: Returns a message indicating whether the post was liked or unliked.

#### Parameters
- `req` (*Object*): The request object containing the authenticated user.
- `res` (*Object*): The response object used to send the HTTP response.
- `postId` (*string*): The ID of the post to be liked or unliked.

---

### 5. `commentOnPost(req, res, postId)`

#### Description
Adds a comment to a post.

#### Flow
- **Input Sanitization**: The `comment` field is sanitized to prevent injection attacks.
- **Post Lookup**: The post is found using the `postId`.
- **Comment Addition**: The comment is added to the post's `comments` array.
- **Response**: If successful, returns the updated comments. If the post is not found, returns an error response.

#### Parameters
- `req` (*Object*): The request object containing the comment and the authenticated user.
- `res` (*Object*): The response object used to send the HTTP response.
- `postId` (*string*): The ID of the post to be commented on.

---

### 6. `deleteComment(req, res, postId, commentId)`

#### Description
Deletes a comment from a post.

#### Flow
- **Post and Comment Lookup**: The post and comment are found using the `postId` and `commentId`.
- **Authorization Check**: Verifies if the user is the author of the comment or an admin.
- **Comment Deletion**: The comment is removed from the post.
- **Response**: If successful, returns a success message. If the post or comment is not found, returns an error response.

#### Parameters
- `req` (*Object*): The request object containing the authenticated user.
- `res` (*Object*): The response object used to send the HTTP response.
- `postId` (*string*): The ID of the post.
- `commentId` (*string*): The ID of the comment to be deleted.

---

### 7. `sharePost(req, res, postId)`

#### Description
Shares an existing post by creating a new post that references the original.

#### Flow
- **Post Lookup**: The original post is found using the `postId`.
- **Post Sharing**: A new post is created, containing the original post's content and a reference to the original post.
- **Response**: If successful, returns the new post. If the original post is not found, returns an error response.

#### Parameters
- `req` (*Object*): The request object containing the authenticated user.
- `res` (*Object*): The response object used to send the HTTP response.
- `postId` (*string*): The ID of the post to be shared.

## Security Considerations

- **Input Sanitization**: All user inputs (title, content, comments) are sanitized using `sanitizer.sanitize()` to prevent injection attacks.
- **Authorization Checks**: For deleting comments, the controller ensures that only the comment's author or an admin can delete the comment.
- **Error Handling**: Robust error handling ensures that proper error messages are returned when posts or comments are not found.

## Error Handling

- **Consistent Responses**: All errors are handled and returned using `responseFormatter.errorResponse()` to ensure consistency across the API.
- **Logging**: Errors and important actions are logged using the `logger` utility for debugging and monitoring purposes.
