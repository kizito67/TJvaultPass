# VaultPass Backend API

## Overview

VaultPass is a secure backend API built with Node.js, Express.js, MongoDB, and JWT authentication.

The system was designed to solve security issues involving:

* Unauthorized access to user data
* Improper admin privileges
* Non-expiring JWT tokens
* Exposed sensitive routes
* Missing suspicious activity logging

---

# Tech Stack

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* bcryptjs
* dotenv
* Morgan

---

# Features

## Authentication

* User Registration
* User Login
* Password Hashing using bcryptjs
* JWT Authentication
* JWT Expiration (1 hour)

## Authorization

Role-Based Access Control:

* user
* moderator
* admin

Protected routes are restricted based on roles.

---

# Security Features

## Account Locking

Accounts are temporarily locked when:

* 5 consecutive failed login attempts occur
* within 10 minutes

Lock duration:

* 15 minutes

---

## Suspicious Activity Logging

The system logs:

* Failed login attempts
* Forbidden route access
* Deleted accounts

Logs are stored in MongoDB.

---

# Project Structure

```bash
VaultPass/
│
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   └── utils/
│
├── .env
├── package.json
├── server.js
└── seedAdmin.js
└── README.md


```

---

# Installation

## Clone Repository

```bash
git clone https://github.com/kizito67/TJvaultPass.git
```

---

# API Endpoints

## Public Route

### GET `/api/public/message`

Response:

```json
{
  "message": "This route is public"
}
```

---

# Authentication Routes

## Register User

### POST `/api/users/register`

Request Body:

```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"
}
```

---

## Login User

### POST `/api/users/login`

Request Body:

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

Response:

```json
{
  "token": "jwt_token",
  "user": {
    "id": "user_id",
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

---

# Protected Routes

## User Profile

### GET `/api/users/profile`

Authorization:

```bash
Bearer Token Required
```

---

## Moderator Reports

### GET `/api/moderator/reports`

Accessible by:

* moderator
* admin

---

## Promote User

### POST `/api/admin/promote/:id`

Accessible by:

* admin only

Rules:

* Admins cannot promote another admin
* Moderators cannot promote users
* Users cannot access route

---

## Delete User

### DELETE `/api/admin/user/:id`

Accessible by:

* admin only

Rules:

* Admins cannot delete themselves

---

# Database Design

## Users Collection

Purpose:
Stores user authentication and authorization data.

Fields:
- fullName
- email
- password
- role
- loginAttempts
- lockUntil

---

## ActivityLogs Collection

Purpose:
Stores suspicious activities and security logs.

Fields:
- action
- user
- ipAddress
- timestamp

## Users Collection

Stores:

* fullName
* email
* hashed password
* role
* login attempts
* lock status

---

## ActivityLogs Collection

Stores:

* action
* user
* ipAddress
* timestamp

---

# Theoretical Questions

## 1. Why is storing plain passwords dangerous?

Plain passwords are dangerous because if a database is breached, hackers can immediately gain access to all user accounts. Many users also use same passwords in different platforms, making the damage even worse.

---

## 2. Difference Between Authentication and Authorization

### Authentication

Authentication verifies who a user is.

Example:

Logging into an application using email and password.

### Authorization

Authorization determines what a user is allowed to do.

Example:

An admin can delete users while a regular user cannot.

---

## 3. Why JWT Expiration is Important

JWT expiration reduces security risks from stolen tokens.

If tokens never expire:

* Attackers can use stolen tokens forever
* Sessions become impossible to revoke properly
* Compromised accounts remain vulnerable indefinitely

---

## 4. Three Ways to Reduce Damage From a Stolen JWT

1. Use short token expiration times
2. Implement refresh tokens
3. Add token revocation or blacklisting

Additional protections:

* HTTPS
* MFA
* Device/IP monitoring

---

## 5. Why Logging Systems Are Sensitive Infrastructure

Logging systems contain important security information such as:

* Failed logins
* Admin actions
* IP addresses
* Suspicious behavior

If attackers access logs, they can:

* Hide evidence
* Learn system structure
* Track users
* Plan future attacks

Therefore, logging systems must be protected carefully.

---

# Author

Oluigbo Chiagoziem
