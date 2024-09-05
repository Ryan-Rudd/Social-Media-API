| **Feature**               | **Method**                             | **API URL**                        | **Progress** |
|---------------------------|----------------------------------------|------------------------------------|--------------|
| **User Management**        | User Registration                     | `/api/v1/auth/register`            | ✔️            |
|                           | User Authentication (Login)           | `/api/v1/auth/login`               | ✔️            |
|                           | User Authentication (Logout)          | `/api/v1/auth/logout`              | ✔️            |
|                           | Password Reset                        | `/api/v1/auth/password-reset`      | ✔️            |
|                           | Get User Profile                      | `/api/v1/users/:userId`            | ✔️            |
|                           | Update User Profile                   | `/api/v1/users/:userId/update`     | ✔️            |
|                           | Follow/Unfollow Users                 | `/api/v1/users/:userId/follow`     | ✔️            |
|                           | List Followers/Following              | `/api/v1/users/:userId/followers`  | ✔️            |
|                           | Get Notifications                     | `/api/v1/users/:userId/notifications` | ✔️         |
|                           | Mark Notifications as Read/Unread     | `/api/v1/users/:userId/notifications/mark` | ✔️      |
|                           | Manage User Preferences               | `/api/v1/users/:userId/preferences` | ✔️          |
| **Content Management**     | Create Post                           | `/api/v1/posts/create`             | ✔️            |
|                           | Edit Post                             | `/api/v1/posts/:postId/edit`       | ✔️            |
|                           | Delete Post                           | `/api/v1/posts/:postId/delete`     | ✔️            |
|                           | Like/Unlike Post                      | `/api/v1/posts/:postId/like`       | ✔️            |
|                           | Comment on Post                       | `/api/v1/posts/:postId/comments`   | ✔️            |
|                           | Delete Comment                        | `/api/v1/posts/:postId/comments/:commentId/delete` | ✔️  |
|                           | Share Post                            | `/api/v1/posts/:postId/share`      | ✔️            |
|                           | Get User’s Posts                      | `/api/v1/users/:userId/posts`      |   ✔️           |
|                           | Get Feed Posts                        | `/api/v1/feed`                     |      ✔️        |
|                           | Upload Image                          | `/api/v1/media/upload/image`       |              |
|                           | Upload Video                          | `/api/v1/media/upload/video`       |              |
|                           | Manage Media                          | `/api/v1/media/:mediaId/manage`    |              |
|                           | Add Tags to Post                      | `/api/v1/posts/:postId/tags`       |              |
|                           | Get Posts by Tag                      | `/api/v1/tags/:tag`                |              |
