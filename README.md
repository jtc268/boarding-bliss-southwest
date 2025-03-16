# BoardingBliss

A modern web interface for the [auto-southwest-check-in](https://github.com/jdholtz/auto-southwest-check-in) Python script.

## Overview

BoardingBliss provides a user-friendly web interface that allows users to easily schedule automatic check-ins for Southwest Airlines flights. The front-end communicates with a lightweight backend API that interfaces with the original auto-southwest-check-in Python script.

## Features

- Mobile-friendly, responsive design
- Simple form for entering flight details
- Real-time status updates
- Automatic check-in exactly 24 hours before departure

## Architecture

The application consists of two main components:

1. **Frontend**: A Next.js application with a React UI
2. **Backend API**: An Express server that communicates with the Python script

## Development Setup

### Prerequisites

- Node.js 16+
- npm or yarn
- Python 3.9+
- auto-southwest-check-in script set up and working

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/boardingbliss.git
   cd boardingbliss
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file:
   ```
   API_URL=http://localhost:3001
   ```

4. Start the development server:
   ```bash
   # In one terminal, start the API server
   node server.js
   
   # In another terminal, start the Next.js frontend
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Import the repository in Vercel
3. Set the following environment variables:
   - `API_URL`: URL of your API server
   - `VERCEL_API_KEY`: Your Vercel API key

4. Deploy!

### API Server Deployment

The API server needs to be deployed separately, on a server that can access the Python script.

1. Set up a VPS or other server
2. Install Node.js and Python requirements
3. Copy the `server.js` file and configure it to point to your auto-southwest-check-in installation
4. Run with pm2 or another process manager:
   ```bash
   pm2 start server.js
   ```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [jdholtz/auto-southwest-check-in](https://github.com/jdholtz/auto-southwest-check-in) for the core check-in functionality 