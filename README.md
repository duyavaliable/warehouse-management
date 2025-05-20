# Express MySQL Backend

This project is a backend application built with Node.js, Express, and MySQL. It serves as a RESTful API for managing users and other resources.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [License](#license)

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/express-mysql-backend.git
   ```

2. Navigate to the project directory:
   ```
   cd express-mysql-backend
   ```

3. Install the dependencies:
   ```
   npm install
   ```

4. Create a `.env` file in the root directory and add your database connection details:
   ```
   DB_HOST=your_database_host
   DB_USER=your_database_user
   DB_PASSWORD=your_database_password
   DB_NAME=your_database_name
   SECRET_KEY=your_secret_key
   ```

## Usage

To start the application, run:
```
npm start
```

The server will start on `http://localhost:3000`.

## API Endpoints

- `GET /api/users` - Retrieve all users
- `POST /api/users` - Create a new user
- `PUT /api/users/:id` - Update a user by ID
- `DELETE /api/users/:id` - Delete a user by ID

## Environment Variables

The following environment variables are required:

- `DB_HOST`: The host of your MySQL database.
- `DB_USER`: The username for your MySQL database.
- `DB_PASSWORD`: The password for your MySQL database.
- `DB_NAME`: The name of your MySQL database.
- `SECRET_KEY`: A secret key for JWT or other purposes.

## License

This project is licensed under the MIT License.