# Online Railway Reservation Management System

A dynamic, full-stack MERN application for railway ticket booking, searching, and admin management. This project features a modern, responsive UI built with Tailwind CSS and React.

## Features

**User Features:**
- Seamless user registration and login with JWT authentication
- Search trains by source and destination
- View available trains and detailed route timings
- Check real-time seat availability
- Book train tickets securely
- View personal booking history via the dashboard
- Cancel booked tickets (automatically updates seat availability)

**Admin Features:**
- Secure Admin Dashboard
- Add new trains to the system
- Edit existing train details
- Delete trains
- Monitor and view all platform bookings across all users

## Technology Stack

**Frontend:**
- React.js (Vite)
- Tailwind CSS (v4) for styling
- React Router DOM
- Axios for API requests
- Lucide React for modern iconography

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- JSON Web Tokens (JWT) for authentication
- bcryptjs for secure password hashing

## Project Structure

```
.
├── backend
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── seed.js
│   └── server.js
└── frontend
    ├── src
    │   ├── api
    │   ├── components
    │   ├── pages
    │   ├── App.jsx
    │   └── main.jsx
    ├── index.html
    └── package.json
```

## Setup & Installation

Follow these steps to run the application locally.

### Prerequisites
- Node.js installed
- MongoDB installed locally (or a MongoDB Atlas URI)

### 1. Database Configuration
By default, the application connects to a local MongoDB instance: `mongodb://127.0.0.1:27017/railway-reservation`. 
If you are using MongoDB Atlas, update the `.env` file in the `backend` folder:
```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=yoursecretkey
```

### 2. Backend Setup
Navigate to the `backend` folder and start the server:

```bash
cd backend
# Install dependencies
npm install

# (Optional) Seed the database with sample trains and users
# This creates an admin user (admin@example.com / admin123) and a regular user
node seed.js

# Run the server in development mode
npm run dev
# OR: node server.js
```
The server will run on `http://localhost:5000`.

### 3. Frontend Setup
Open a new terminal, navigate to the `frontend` folder, and start the Vite development server:

```bash
cd frontend
# Install dependencies
npm install

# Run the frontend server
npm run dev
```
The frontend will open (usually on `http://localhost:5173`).

## Usage & Testing

### Sample Users (if you ran `node seed.js`)
- **Admin**: Email: `admin@example.com` | Password: `admin123`
- **User**: Email: `user@example.com` | Password: `admin123`

### Workflows to Test
1. **Search**: Enter "New Delhi" to "Mumbai" on the home page and search.
2. **Book**: Select a train, pick a date, and book. Note that the available seats will decrease.
3. **Cancel**: Go to "My Bookings" and cancel a ticket. The seats will increase.
4. **Admin**: Log in as admin, go to the Admin panel, and manage trains.

## Built With ❤️
Built using React, Node, Express, and Tailwind CSS.
