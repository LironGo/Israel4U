# Israel4U - Social Network Platform

A comprehensive social network platform designed to help people during emergencies, built with Node.js, Express, MongoDB, and React.

## Features

### User Management
- User registration with email verification
- User categories: Evacuees, Injured, Reservists, Regular Soldiers
- Profile management with region and city settings
- Friend system for connecting users

### Groups
- Create and manage social groups
- Group categories matching user categories
- Join requests with approval system
- Group managers with enhanced permissions

### Posts & Interactions
- Create posts with categories and types
- Like and comment functionality
- Save posts for later reference
- Pin important posts (group managers only)
- Search and filter posts

### Real-time Chat
- Socket.IO powered real-time messaging
- Private conversations between users
- Message read status tracking

### Search & Analytics
- Advanced search across users, groups, and posts
- Multiple filter options (region, city, category)
- D3.js powered statistics and charts
- Posts per month analytics
- User and group category statistics

## Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **Socket.IO** - Real-time communication
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **nodemailer** - Email functionality

### Frontend (to be implemented)
- **React** - Frontend framework
- **jQuery** - DOM manipulation and AJAX
- **D3.js** - Data visualization
- **CSS3** - Styling with advanced features

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd israel4u-project-new
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/israel4u

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-here

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Cloudinary Configuration (for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Email Configuration (for verification and password reset)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-app-password

# Server Port
PORT=5000

# Node Environment
NODE_ENV=development
```

4. Start MongoDB service

5. Run the development server:
```bash
npm run dev
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/verify-email` - Verify email with code
- `POST /api/auth/login` - Login user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with code
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users/search` - Search users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `DELETE /api/users/profile` - Delete user account
- `POST /api/users/friends/:id` - Add friend
- `DELETE /api/users/friends/:id` - Remove friend
- `GET /api/users/:id/posts` - Get user's posts

### Groups
- `POST /api/groups` - Create group
- `GET /api/groups` - Get all groups
- `GET /api/groups/:id` - Get group by ID
- `PUT /api/groups/:id` - Update group
- `DELETE /api/groups/:id` - Delete group
- `POST /api/groups/:id/join` - Request to join group
- `PUT /api/groups/:id/requests/:requestId` - Handle join request
- `DELETE /api/groups/:id/leave` - Leave group
- `GET /api/groups/:id/posts` - Get group posts

### Posts
- `POST /api/posts` - Create post
- `GET /api/posts` - Get feed posts
- `GET /api/posts/search` - Search posts
- `GET /api/posts/:id` - Get post by ID
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post
- `POST /api/posts/:id/save` - Save/unsave post
- `POST /api/posts/:id/pin` - Pin/unpin post

### Comments
- `POST /api/comments` - Create comment
- `GET /api/comments/:postId` - Get post comments
- `PUT /api/comments/:id` - Update comment
- `DELETE /api/comments/:id` - Delete comment

### Likes
- `POST /api/likes/:postId` - Like/unlike post
- `GET /api/likes/:postId/check` - Check if user liked post
- `GET /api/likes/:postId` - Get post likes

### Chats
- `GET /api/chats` - Get user conversations
- `GET /api/chats/:conversationId` - Get conversation messages
- `POST /api/chats/:conversationId` - Send message
- `POST /api/chats/user/:userId` - Create conversation with user
- `PUT /api/chats/:conversationId/read` - Mark messages as read

### Statistics
- `GET /api/stats/posts-per-month` - Posts per month chart
- `GET /api/stats/user-categories` - User category statistics
- `GET /api/stats/group-categories` - Group category statistics
- `GET /api/stats/posts-by-type` - Posts by type statistics
- `GET /api/stats/posts-by-region` - Posts by region statistics
- `GET /api/stats/avg-posts-per-group` - Average posts per group

## Database Models

### User
- Basic info (email, password, fullName, phone)
- Location (region, city)
- Categories (isEvacuee, isInjured, isReservist, isRegularSoldier)
- Relationships (friends, groups, managedGroups)
- Email verification and password reset

### Group
- Basic info (name, description, city, region)
- Categories matching user categories
- Management (manager, members, joinRequests)
- Settings (isPrivate, pinnedPosts)

### Post
- Content and metadata
- Categories matching user categories
- Post types (help_request, support_offer, general, emergency)
- Interactions (likes, comments, saves, pins)

### Message & Conversation
- Real-time messaging system
- Conversation management
- Message status tracking

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Email verification system
- Password reset functionality
- CORS protection
- Input validation and sanitization
- Authorization middleware for protected routes

## Real-time Features

- Socket.IO for real-time chat
- Live message delivery
- Conversation room management
- Message status updates

## Search & Filtering

- Text search across multiple collections
- Category-based filtering
- Region and city filtering
- Advanced search with multiple parameters

## Statistics & Analytics

- D3.js powered charts
- Posts per month analytics
- User and group category statistics
- Post type and region analytics
- Average posts per group metrics

## Project Structure

```
israel4u-project-new/
├── config/
│   └── config.js
├── controllers/
│   ├── authController.js
│   ├── usersController.js
│   ├── groupsController.js
│   ├── postsController.js
│   ├── commentController.js
│   ├── likeController.js
│   ├── chatsController.js
│   └── statsController.js
├── middleware/
│   └── authMiddleware.js
├── models/
│   ├── User.js
│   ├── Group.js
│   ├── Post.js
│   ├── Comment.js
│   ├── Like.js
│   ├── Message.js
│   └── Conversation.js
├── routes/
│   ├── auth.js
│   ├── users.js
│   ├── groups.js
│   ├── posts.js
│   ├── comments.js
│   ├── likes.js
│   ├── chats.js
│   └── stats.js
├── utils/
│   └── emailService.js
├── package.json
├── server.js
└── README.md
```

## Development Guidelines

This project follows the StudyVerse-main patterns and uses only technologies taught by the course instructor:

- Simple and minimal code structure
- No advanced external libraries beyond course materials
- Student-level implementation complexity
- Clear separation of concerns (MVC pattern)
- Comprehensive error handling and validation

## Next Steps

1. Implement the React frontend
2. Add image upload functionality with Cloudinary
3. Implement D3.js charts for statistics
4. Add CSS3 advanced features (text-shadow, transitions, etc.)
5. Add jQuery functionality for DOM manipulation
6. Implement video and canvas features
7. Add comprehensive testing

## License

This project is created for educational purposes as part of a Computer Science course assignment. 