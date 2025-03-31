# Rumor App

A web application for posting and searching rumors associated with usernames.
<img width="1728" alt="Screenshot 2025-03-31 at 4 07 48 AM" src="https://github.com/user-attachments/assets/3f0e33f3-aba2-4363-bbdf-a9fc8d9536f5" />
<img width="1728" alt="Screenshot 2025-03-31 at 4 08 54 AM" src="https://github.com/user-attachments/assets/2e839333-e8bb-427a-989b-725f76c67a1d" />

## Features

- Post rumors about one or multiple users
- Search for rumors about specific users
- View rumors about a single user or involving multiple users

## Tech Stack

- Frontend: React
- Backend: Node.js with Express
- Database: MongoDB

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally on port 27017)

## Setup Instructions
<img width="1728" alt="Screenshot 2025-03-31 at 4 07 41 AM" src="https://github.com/user-attachments/assets/6895fe96-8ca0-4c7f-9695-c1896d1d9b1e" />

1. Clone the repository
2. Install dependencies:
   ```bash
   npm run install-all
   ```
3. Start MongoDB locally:
   ```bash
   mongod
   ```
4. Start the application:
   ```bash
   npm start
   ```

The frontend will be available at http://localhost:3000
The backend API will be available at http://localhost:5000

## Project Structure

- `/client` - React frontend application
- `/server` - Node.js/Express backend application 
