# Geolocation Project

## Overview

This project is a geolocation-based application that allows users to create accounts, authenticate securely with token-based authentication, and set their location using the Google Maps API. The project is built with a Python backend, handling authentication, database interactions, and communication with the Google Maps API.

## Features

1. Account Creation: Users can create an account with unique credentials.
2. Token-Based Authentication: Ensures secure login sessions using tokens, enabling protected access to location services.
3. Location Setting with Google Maps: Integrated with Google Maps API, allowing users to set and update their location on an interactive map.
4. Backend in Python: The backend handles data management, address management, token issuance, and authentication securely and efficiently.

## Tech Stack

1. Frontend: Built using [your preferred frontend framework/library, e.g., React Native, React].
2. Backend: Python, FastAPI, MySQL (with pymysql for database interactions).
3. Google Maps API: Integrated for setting and displaying user locations.
4. Authentication: JSON Web Tokens (JWT) for token-based security.

## How To Run My Project

### 1. Setup the Database

1. Create the users and addresses tables using the SQL queries given in the DB folder.
2. Edit the get_db_connection() function in the backend folder according to your SQL credentials

### 2. Setup the Backend

1. Install the python dependencies.
2. `cd backend` and run `uvicorn main:app --reload`

### 2. Setup the Frontend

1. `cd frontend` and `npm install` to download node modules
2. `npx react-native run-android` for android
3. `npx react-native run-ios` for ios
