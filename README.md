# Educrust LMS

## Project Overview
Educrust LMS is an advanced Learning Management System designed to facilitate online education through a feature-rich platform. It provides an intuitive interface for educators and learners, optimizing the learning experience.

## Features
- User-friendly interface for students and instructors
- Course management and enrollment
- Interactive quizzes and assessments
- Progress tracking and reporting
- Real-time communication tools

## Tech Stack
- Frontend: React.js, Redux
- Backend: Node.js, Express
- Database: MongoDB
- Authentication: JWT
- Containerization: Docker

## Architecture
The system follows a microservices architecture ensuring scalability and maintainability. Core services focus on user management, course delivery, and reporting.

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/navanithaadhav/Educrust-LMS.git
   ```
2. Navigate to the project directory:
   ```bash
   cd Educrust-LMS
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## API Documentation
Refer to the [API Documentation](./api-docs) for detailed information about the available endpoints, request/response formats, and authentication.

## Docker Setup
To run the application using Docker:
1. Build the Docker image:
   ```bash
   docker build -t educrust-lms .
   ```
2. Run the Docker container:
   ```bash
   docker run -p 3000:3000 educrust-lms
   ```

## Database Schema
The database consists of the following collections:
- Users
- Courses
- Enrollments
- Quizzes

## Authentication
Educrust LMS uses JSON Web Tokens (JWT) for authentication, ensuring secure access to APIs and user data.

## Real-Time Features
The platform includes real-time chat functionality allowing users to interact seamlessly.

## Contributing Guidelines
We welcome contributions! Please follow these steps:
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a pull request

## License
This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
