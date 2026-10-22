# SigmaGPT --- ChatGPT Clone

SigmaGPT is a full-stack ChatGPT-style web application built for
learning and project practice. It provides a chat interface where users
can sign up, log in, send prompts, receive AI-generated responses, and
revisit previous conversations.

## Features

-   User sign-up and login
-   AI-powered chat interface
-   Conversation history in the sidebar
-   Open and continue previous conversations
-   Delete conversations
-   Responsive dark-themed interface
-   Backend API for chat and thread management
-   MongoDB integration for storing application data

## Tech Stack

**Frontend** - React - Vite - JavaScript - CSS

**Backend** - Node.js - Express.js - MongoDB and Mongoose - OpenAI API

## Project Structure

``` text
SigmaGPT/
├── backend/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── server.js
│   ├── package.json
│   └── .env                 # Create locally; do not commit
├── frontend/
│   ├── public/
│   ├── src/
│   ├── index.html
│   ├── package.json
│   └── .env                 # Create locally only if your frontend needs variables
├── .gitignore
└── README.md
```

## Prerequisites

Install the following before running the project:

-   [Node.js](https://nodejs.org/) (includes npm)
-   A MongoDB database, such as [MongoDB
    Atlas](https://www.mongodb.com/atlas)
-   An OpenAI API key from the [OpenAI
    platform](https://platform.openai.com/)

## Getting Started

### 1. Clone the repository

``` bash
git clone https://github.com/suhanijadhav2208/SigmaGPT.git
cd SigmaGPT
```

### 2. Install backend dependencies

``` bash
cd backend
npm install
```

### 3. Configure backend environment variables

Create a `.env` file inside the `backend` folder. Add the environment
variable names required by your backend code, such as your MongoDB
connection string, OpenAI API key, and authentication secret.

For example, your file may contain entries like:

``` env
MONGODB_URI=your_mongodb_connection_string
OPENAI_API_KEY=your_openai_api_key
JWT_SECRET=replace_with_a_long_random_secret
```

**Important:** These names are examples. Check the backend source code
and use the exact variable names your application expects. Never commit
`.env` files or share real API keys, database passwords, or
authentication secrets.

### 4. Start the backend

From the `backend` directory, run the start command defined in
`backend/package.json`. For example, if the project has a `start`
script:

``` bash
npm start
```

If your project uses a development script instead, use:

``` bash
npm run dev
```

The backend in the current development setup uses port `8080`.

### 5. Install frontend dependencies

Open a **second terminal** at the project root and run:

``` bash
cd frontend
npm install
```

### 6. Start the frontend

``` bash
npm run dev
```

Open the local address printed by Vite in your terminal. In the current
development setup, this is usually:

``` text
http://localhost:5173
```

Keep both frontend and backend terminals running while using the
application.

## API and Configuration Notes

-   The frontend currently sends chat requests to the local backend at
    `http://localhost:8080`.
-   The backend must be running for login, chat, and
    conversation-history features to work.
-   Make sure your MongoDB connection and OpenAI API key are configured
    correctly.
-   If you change ports or environment variable names, update the
    relevant configuration in the source code.

## Security

-   Do not upload `.env` files, API keys, database credentials, JWT
    secrets, or other private credentials.
-   Keep `node_modules/` out of version control; dependencies can be
    restored with `npm install`.
-   If a secret has ever been committed to a public repository, remove
    it from the repository and its history as appropriate, and
    rotate/revoke the exposed credential. Simply adding it to
    `.gitignore` does not erase it from earlier commits.
-   Use appropriate authentication, authorization, input validation, and
    rate limiting before deploying a public instance.

## Current Status

This is a learning project intended to demonstrate a basic full-stack AI
chat application. Additional production-readiness work may be needed
before public deployment.

## Author

**Suhani Jadhav**

## License

No license has been specified yet. Unless a license is added to this
repository, others should not assume they have permission to reuse,
modify, or redistribute the code.
