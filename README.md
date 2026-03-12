# Admin Panel Base

A robust and scalable backend foundation for building an Admin Panel. This project provides a well-structured RESTful API built with **Node.js, Express, and MongoDB**, including essential features like Role-Based Access Control (RBAC), authentication, audit logging, and basic CRUD operations.

## Features

- **Authentication & Security:** JWT-based authentication, bcrypt password hashing, and Helmet for HTTP header security.
- **Role-Based Access Control (RBAC):** Advanced authorization system with Users, Roles, UserRoles, and RolePrivileges matrices.
- **Audit Logging:** Built-in mechanisms to track system actions.
- **RESTful API endpoints:** Ready-to-use controllers and routes for Authentication and Categories.
- **Global Error Handling:** Centralized middleware for consistent API error responses.
- **Docker Ready:** Includes `Dockerfile` and `docker-compose.yml` for effortless containerized deployment with MongoDB.
- **Postman Collection:** Ready-to-use Postman collection (`admin-panel.postman_collection.json`) for quick endpoint testing.

## Tech Stack

- **Backend Framework:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Authentication:** JSON Web Tokens (JWT), Bcrypt
- **Security:** Helmet, CORS
- **Containerization:** Docker, Docker Compose

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (if running locally)
- Docker and Docker Compose (optional, for containerized setup)

### Installation (Local)

1. Navigate to the project directory:
   ```bash
   cd "Admin Panel"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env` file in the root of the project with the following (or use existing if available):
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/admin-panel
   JWT_SECRET=supersecretkey123
   JWT_EXPIRY=1d
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Running with Docker

You can easily spin up the application and an attached MongoDB instance using Docker Compose.

1. Navigate to the project directory:
   ```bash
   cd "Admin Panel"
   ```
2. Start the services:
   ```bash
   docker-compose up -d --build
   ```

This will expose the API on port `3000` (as mapped in `docker-compose.yml`) and run MongoDB locally.

## Project Structure

```
Admin Panel/
├── config/             # Database connection configuration
├── controllers/        # Business logic for routes
├── lib/                # Utility classes, helpers, and generic components
├── middlewares/        # Express app middlewares (e.g., error handling, auth)
├── models/             # Mongoose database schemas (User, Role, AuditLogs, etc.)
├── routes/             # Express API route definitions
├── scripts/            # Helper scripts (e.g., seeders)
├── docker-compose.yml  # Docker Compose configuration
├── Dockerfile          # Docker image configuration
├── server.js           # Application entry point
└── package.json        # Project metadata and dependencies
```

## API Documentation
You can find the endpoints and test them directly by importing the provided `admin-panel.postman_collection.json` file into your Postman application.

## License
MIT License
