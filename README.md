# Rumor App

A web application for posting and searching rumors associated with usernames.

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