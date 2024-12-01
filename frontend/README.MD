# CSV Import App

## Overview

CSV Import App is a full-stack application built with React, TypeScript, and Vite for the frontend, and Node.js with Express for the backend. This application allows users to upload CSV files and view the imported data in a structured format.

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [Usage](#usage)
- [Frontend](#frontend)
- [Linting and Formatting](#linting-and-formatting)
- [Testing](#testing)

## Features

- Upload CSV files
- View imported data in a table format
- Responsive design
- Type-safe code with TypeScript

## Technologies

- **Frontend:**
  - React
  - TypeScript
  - Vite
  - Tailwind CSS
  - Axios


## Installation

### Prerequisites

- Node.js (v18 or higher)
- npm 

### Install dependencies

#### Frontend

```bash
npm install
```

## Usage

### Running the Frontend

To start the frontend development server, run:

```bash
npm run dev
```

This will start the Vite development server.


## Frontend

The frontend is built using React and TypeScript. The main entry point is located in `src/main.tsx`, and the main application component is in `src/App.tsx`. The application uses Tailwind CSS for styling.

### Components

- **FileUpload**: Component for uploading CSV files.
- **DataTable**: Component for displaying the imported data.

