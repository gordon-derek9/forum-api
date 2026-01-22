# Forum API

A RESTful backend API for a forum application built with Node.js, Express, and MongoDB.

## Features

- User authentication (register & login)
- JWT-protected routes
- CRUD operations for:
  - Categories
  - Topics
  - Posts
- Health check endpoint
- Modular 3-tier architecture

## Tech Stack

- Node.js
- Express
- MongoDB
- Mongoose
- JWT Authentication
- dotenv
- CORS

## API Endpoints

### Auth
- POST `/api/auth/register`
- POST `/api/auth/login`

### Categories
- GET `/api/categories`
- POST `/api/categories`
- PUT `/api/categories/:id`
- DELETE `/api/categories/:id`

### Topics
- GET `/api/topics`
- POST `/api/topics`
- PUT `/api/topics/:id`
- DELETE `/api/topics/:id`

### Posts
- GET `/api/posts`
- POST `/api/posts`
- PUT `/api/posts/:id`
- DELETE `/api/posts/:id`

### Health Check
- GET `/health`

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
