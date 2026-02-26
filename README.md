# Educrust-LMS

## Project Overview
Educrust-LMS is a Learning Management System that aims to provide a platform for educational institutions to manage courses, students, and resources effectively. The application supports various educational features to enhance the learning experience.

## Features
- Course management (create, update, delete courses)
- User management (students, instructors, administrators)
- Assignment and assessment management
- Progress tracking and analytics
- Responsive design for mobile and desktop users

## Tech Stack
- **Frontend**: React.js, Redux, Bootstrap
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Containerization**: Docker

## Installation
To run the project locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/navanithaadhav/Educrust-LMS.git
   ```

2. Navigate to the project directory:
   ```bash
   cd Educrust-LMS
   ```

3. Install dependencies for the backend:
   ```bash
   cd backend
   npm install
   ```

4. Install dependencies for the frontend:
   ```bash
   cd ../frontend
   npm install
   ```

5. Start the backend server:
   ```bash
   cd ../backend
   npm start
   ```

6. Start the frontend application:
   ```bash
   cd ../frontend
   npm start
   ```

## Docker Setup
To run the application using Docker, ensure you have Docker installed on your machine.

1. Build the Docker images:
   ```bash
   docker-compose build
   ```

2. Start the application:
   ```bash
   docker-compose up
   ```

3. Access the application at `http://localhost:3000`

## API Documentation
The API provides endpoints for managing the educational resources. Here are some of the key endpoints:

- **GET /api/courses**: Retrieve the list of courses
- **POST /api/courses**: Create a new course
- **GET /api/users**: Retrieve user information
- **POST /api/auth/login**: User login

Please refer to the [API documentation](https://your-api-docs-link) for complete details.

## Contributing Guidelines
We welcome contributions! If you wish to contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes and commit (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Open a pull request.

## Project Structure
The project is organized as follows:

```
Educrust-LMS/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── config/
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   └── utils/
```

- `backend/`: Contains the server-side code.
- `frontend/`: Contains the client-side code.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
