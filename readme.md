# 🔐 Authentication System (Node.js + Express + MongoDB)

A complete backend authentication system supporting **User and Admin roles**, featuring email verification, JWT-based authentication, protected routes, and password reset via email.

---

## Features

### User Authentication
- User Signup
- Email Verification (via token)
- Login with JWT
- Protected Route (`/profile`)
- Forgot Password (email-based)
- Reset Password

### Admin Authentication
- Admin Signup
- Email Verification
- Login with JWT
- Protected Route (`/profile`)
- Forgot Password
- Reset Password

### Security Features
- Password hashing using **bcrypt**
- JWT authentication & authorization
- Email verification tokens
- Password reset tokens
- Middleware-based route protection
- Environment variable configuration

---

## Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcrypt
- **Email Service:** Custom email service (Nodemailer or similar)

---

## Project Structure

```
project-root
│
├── routes
│   ├── admin.js
│   └── user.js
│
├── middleware
│   ├── adminMiddleware.js
│   └── userMiddleware.js
│
├── services
│   └── emailService.js
│
├── db
│   └── index.js
│
├── .env
├── index.js
└── package.json
```

---

## Environment Variables

Create a `.env` file in the root directory:

```
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=admin_jwt_secret
USER_JWT_SECRET=user_jwt_secret
```

---

## API Endpoints

### User Routes

| Method | Endpoint | Description |
|------|----------|-------------|
| POST | `/user/signup` | Register a new user |
| GET | `/user/verify-email?token=` | Verify email |
| POST | `/user/login` | Login user |
| GET | `/user/profile` | Protected route |
| POST | `/user/forgot-password` | Send reset link |
| POST | `/user/reset-password?token=` | Reset password |

---

### Admin Routes

| Method | Endpoint | Description |
|------|----------|-------------|
| POST | `/admin/signup` | Register admin |
| GET | `/admin/verify-email?token=` | Verify email |
| POST | `/admin/login` | Login admin |
| GET | `/admin/profile` | Protected route |
| POST | `/admin/forgot-password` | Send reset link |
| POST | `/admin/reset-password?token=` | Reset password |

---

## Authentication Flow

### Signup Flow
1. User/Admin registers
2. Password is hashed using bcrypt
3. Verification token generated
4. Email sent with verification link

### Login Flow
1. User/Admin logs in
2. Password compared using bcrypt
3. JWT token generated
4. Token used for protected routes

### Password Reset Flow
1. User requests reset link
2. Token generated and emailed
3. User submits new password
4. Password updated after verification

---

## Middleware

### User Middleware
- Verifies JWT from headers
- Attaches decoded user to `req.user`

### Admin Middleware
- Verifies JWT
- Attaches decoded admin to `req.admin`

---

## Testing

Use tools like:
- Postman
- Thunder Client

Example:
```
POST /user/login
```

Body:
```json
{
  "email": "test@example.com",
  "password": "123456"
}
```

---

## Known Improvements (Future Enhancements)

- Add reset token expiry
- Add rate limiting (prevent brute force attacks)
- Add input validation (Zod/Joi)
- Refactor duplicate logic (admin/user services)
- Add frontend UI for reset password

---

## Author

Aryan Raj

---

## Conclusion

This is a **production-style authentication backend** covering:
- Secure login system
- Email-based verification
- Token-based authentication
- Password recovery