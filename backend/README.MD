# CSV Import App

## Overview

CSV Import App is a full-stack application built with React, TypeScript, and Vite for the frontend, and Node.js with Express for the backend. This application allows users to upload CSV files and view the imported data in a structured format.

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [Usage](#usage)
- [Backend](#backend)
- [Linting and Formatting](#linting-and-formatting)
- [Testing](#testing)

## Features

- Upload CSV files
- View imported data in a table format
- Responsive design
- Type-safe code with TypeScript

## Technologies


- **Backend:**
  - Node.js
  - Express
  - TypeScript
  - Sequelize (for database interaction)
  - PostgreSQL

## Installation

### Prerequisites

- Node.js (v18 or higher)
- npm 
- PostgreSQL (for the backend)

### Install dependencies

#### Backend

```bash
npm install
```

## Usage

### Running the Backend

To start the backend server, run:

```bash
npm run dev
```

This will start the Express server.

## Backend

The backend is built using Node.js and Express. The main application file is located in `src/app.ts`. The backend handles file uploads, processes CSV data, and serves the API endpoints.

### Database Configuration

The application uses PostgreSQL as the database. Ensure that your database is set up and configured correctly in the `src/config/database.ts` file.


## Testing

The backend uses Jest for testing. To run the tests, navigate to the backend directory and run:

```bash
npm test
```

