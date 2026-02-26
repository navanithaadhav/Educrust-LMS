# Educrust LMS

## Project Overview
Educrust LMS is an advanced Learning Management System designed to facilitate online education through a feature-rich platform. It provides an intuitive interface for educators and learners, optimizing the learning experience.

## Features
- **Multi-role Authentication:** Secure access for Students, Educators, and Admins.
- **Course Management:** Create and manage courses effortlessly.
- **Video Players:** Integrated video players for effective course delivery.
- **Quizzes:** Interactive quizzes to test knowledge and improve learning outcomes.
- **Payments:** Integrated payment solutions using Stripe and Razorpay for course fees.
- **AI Chatbot:** Provide instant support and answers to common queries.
- **Certificates:** Generate and issue certificates upon course completion.
- **Real-time Communication:** Engage with students and educators through seamless communication channels.
- **Responsive Design:** A user-friendly interface that works on various devices.
- **Docker Support:** Easy deployment and containerization for scalable applications.

## Tech Stack
- **Frontend:** React, TypeScript  
- **Backend:** Express  
- **Database:** MongoDB with Mongoose  
- **Authentication & Authorization:** Clerk for user management and multi-role authentication (Student, Educator, Admin)  
- **Real-time Communication:** Socket.io  
- **Payment Integration:** Stripe and Razorpay  
- **Cloud Storage:** Cloudinary for managing media assets  
- **Email Notifications:** Nodemailer  
- **Authentication with Google:** Google Auth


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
