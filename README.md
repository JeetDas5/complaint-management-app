# 🎯 Complaint Management System

A modern, full-stack complaint management application built with Next.js, MongoDB, and TypeScript. This system allows users to submit complaints and administrators to manage them efficiently with automated email notifications.

![Next.js](https://img.shields.io/badge/Next.js-15.4.5-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-6.18.0-green)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-blue)

## Live Demo

[Deployed URL](https://complaint-management-app-ashy.vercel.app/)

## ✨ Features

- **User Authentication**: Secure registration and login system with JWT tokens
- **Role-Based Access**: Separate interfaces for users and administrators
- **Complaint Management**: Submit, view, and manage complaints with categories and priorities
- **Status Tracking**: Real-time complaint status updates (Pending → In Progress → Resolved)
- **Email Notifications**: Beautiful HTML email templates for new complaints and status updates
- **Responsive Design**: Modern UI that works on all devices
- **Admin Dashboard**: Comprehensive admin panel for complaint management

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- MongoDB database
- Gmail account (for email notifications)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/JeetDas5/complaint-management-app
   cd complaint-management-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your configuration:
   ```env
   MONGO_URI=mongodb://localhost:27017/complaint-management
   # or MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/complaint-management
   
   GOOGLE_APP_PASSWORD=your_gmail_app_password
   ADMIN_EMAILS=admin@example.com,admin2@example.com
   JWT_SECRET=your_super_secret_jwt_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗄️ MongoDB Setup


### MongoDB Atlas (Cloud)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get connection string and add to `MONGO_URI`
4. Whitelist your IP address

### Database Collections
The application automatically creates these collections:
- `users` - User accounts and authentication
- `complaints` - Complaint records with status tracking

## 📧 Email Configuration

### Gmail Setup
1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. Use the generated password in `GOOGLE_APP_PASSWORD`

### Email Templates
The system includes two beautiful HTML email templates:
- **New Complaint**: Sent when a complaint is submitted
- **Status Update**: Sent when complaint status changes


## 🔐 Authentication & Authorization

### User Roles
- **User**: Can submit and view their own complaints
- **Admin**: Can view all complaints and update statuses

### JWT Token Structure
```json
{
  "userId": "user_mongodb_id",
  "role": "user|admin",
  "iat": 1234567890,
  "exp": 1234567890
}
```

## 📚 API Documentation

### Authentication Endpoints

#### POST `/api/auth/register`
Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123",
  "role": "user" // optional, defaults to "user"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "token": "jwt_token_here"
  }
}
```

#### POST `/api/auth/login`
Authenticate user and get access token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "token": "jwt_token_here"
  }
}
```

#### POST `/api/auth/verify`
Verify JWT token validity.

**Request Body:**
```json
{
  "token": "jwt_token_here"
}
```

**Response (200):**
```json
{
  "valid": true,
  "userId": "user_id",
  "role": "user"
}
```

### Complaint Endpoints

#### POST `/api/complaint`
Submit a new complaint (requires authentication).

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Request Body:**
```json
{
  "title": "Website Loading Issues",
  "description": "The website is loading very slowly...",
  "category": "Technical",
  "priority": "high" // "low" | "medium" | "high"
}
```

**Response (201):**
```json
{
  "message": "Complaint created successfully",
  "complaint": {
    "_id": "complaint_id",
    "title": "Website Loading Issues",
    "description": "The website is loading very slowly...",
    "category": "Technical",
    "priority": "high",
    "status": "pending",
    "dateSubmitted": "2024-01-15T10:30:00.000Z",
    "user": "user_id"
  }
}
```

#### GET `/api/complaint`
Get all complaints (admin only).

**Headers:**
```
Authorization: Bearer admin_jwt_token_here
```

**Response (200):**
```json
[
  {
    "_id": "complaint_id",
    "title": "Website Loading Issues",
    "description": "The website is loading very slowly...",
    "category": "Technical",
    "priority": "high",
    "status": "pending",
    "dateSubmitted": "2024-01-15T10:30:00.000Z",
    "user": {
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
]
```

#### PATCH `/api/complaint/[id]`
Update complaint status (admin only).

**Headers:**
```
Authorization: Bearer admin_jwt_token_here
```

**Request Body:**
```json
{
  "status": "in-progress" // "pending" | "in-progress" | "resolved"
}
```

**Response (200):**
```json
{
  "message": "Complaint updated successfully",
  "complaint": {
    "_id": "complaint_id",
    "title": "Website Loading Issues",
    "status": "in-progress",
    // ... other fields
  }
}
```

#### DELETE `/api/complaint/[id]`
Delete a complaint (admin only).

**Headers:**
```
Authorization: Bearer admin_jwt_token_here
```

**Response (200):**
```json
{
  "message": "Complaint deleted successfully"
}
```

## 🎨 Application Screenshots

### Home Page
![Home Page](public/screenshots/home.png)
*Landing page with navigation and feature overview*

### User Registration
![User Registration](public/screenshots/register.png)
*Clean and intuitive registration form with role selection*

### User Login
![User Login](public/screenshots/login.png)
*Secure login with email and password authentication*

### Submit Complaint
![Submit Complaint](public/screenshots/submit.png)
*Easy-to-use complaint submission form with categories and priorities*

### Admin Dashboard
![Admin Dashboard](public/screenshots/admin.png)
*Comprehensive admin panel showing all complaints with status management*

### Email Templates
![Email Template](public/screenshots/email.png)
*Beautiful HTML email notifications for new complaints and status updates*


## 🛠️ Development

### Project Structure
```
complaint-management-app/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   └── complaint/     # Complaint management endpoints
│   ├── admin/             # Admin dashboard
│   ├── login/             # Login page
│   ├── register/          # Registration page
│   ├── submit/            # Complaint submission
│   └── email-preview/     # Email template preview
├── components/            # Reusable React components
│   ├── ui/               # UI components (buttons, inputs, etc.)
│   ├── Email.tsx         # Email template component
│   └── EmailPreview.tsx  # Email preview component
├── lib/                  # Utility functions
│   ├── auth.ts           # JWT authentication
│   ├── db.ts             # MongoDB connection
│   ├── sendEmail.ts      # Email sending functionality
│   └── emailTemplates.tsx # HTML email generators
├── models/               # MongoDB schemas
│   ├── User.ts           # User model
│   └── Complaint.ts      # Complaint model
└── types/                # TypeScript type definitions
```

### Available Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Environment Variables
| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/complaints` |
| `GOOGLE_APP_PASSWORD` | Gmail app password for emails | `abcd efgh ijkl mnop` |
| `ADMIN_EMAILS` | Comma-separated admin emails | `admin@example.com,admin2@example.com` |
| `JWT_SECRET` | Secret key for JWT tokens | `your-super-secret-key-here` |

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms
- **Netlify**: Configure build settings and environment variables
- **Railway**: Connect GitHub and set environment variables
- **Heroku**: Use Heroku CLI or GitHub integration

## 🔧 Troubleshooting

### Common Issues

**MongoDB Connection Error**
```bash
Error: connect ECONNREFUSED 127.0.0.1:27017
```
- Ensure MongoDB is running locally
- Check connection string in `.env.local`

**Email Not Sending**
```bash
Error: Invalid login: 535-5.7.8 Username and Password not accepted
```
- Verify Gmail app password is correct
- Ensure 2FA is enabled on Gmail account

**JWT Token Invalid**
```bash
Error: jwt malformed
```
- Check JWT_SECRET in environment variables
- Ensure token is properly formatted in Authorization header

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [MongoDB](https://www.mongodb.com/) - Database
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Radix UI](https://www.radix-ui.com/) - UI components
- [Nodemailer](https://nodemailer.com/) - Email sending

---

**Made with ❤️ by Jeet Das**

For support or questions, please open an issue or contact [jeet15083011@gmail.com]