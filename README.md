# Uber API Documentation

## User Endpoints

### Base URL

```
/api/users
```

---

## Endpoints

### 1. Get All Users

**Endpoint:** `GET /users`

**Description:** Fetch all registered users in the system.

**Authentication:** ✅ Required (Bearer Token)

**Query Parameters:** None

**Request Headers:**

```json
{
  "Authorization": "Bearer <token>"
}
```

**Response Status Codes:**

- **200 OK** - Users fetched successfully
- **401 Unauthorized** - Invalid or missing token
- **500 Internal Server Error** - Server error

**Success Response Example (200):**

```json
{
  "success": true,
  "message": "All users fetched successfully",
  "data": [
    {
      "_id": "user_id",
      "fullName": {
        "firstName": "John",
        "lastName": "Doe"
      },
      "email": "john@example.com",
      "phone": "+1234567890",
      "role": "user",
      "profilePicture": "url_to_picture"
    }
  ]
}
```

---

### 2. Register User

**Endpoint:** `POST /users/register`

**Description:** Create a new user account and receive an authentication token.

**Authentication:** ❌ Not Required

**Request Body (Required):**

```json
{
  "fullName": {
    "firstName": "string (required)",
    "lastName": "string (required)"
  },
  "email": "string (required, unique)",
  "password": "string (required)",
  "phone": "string (optional)",
  "role": "string (optional, default: 'user')"
}
```

**Response Status Codes:**

- **201 Created** - User registered successfully
- **400 Bad Request** - Missing required fields or email already registered
- **500 Internal Server Error** - Server error

**Success Response Example (201):**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "_id": "user_id",
    "fullName": {
      "firstName": "John",
      "lastName": "Doe"
    },
    "email": "john@example.com",
    "phone": "+1234567890",
    "role": "user"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Response Example (400):**

```json
{
  "success": false,
  "message": "First name and last name are required"
}
```

```json
{
  "success": false,
  "message": "Email already registered"
}
```

---

### 3. Login User

**Endpoint:** `POST /users/login`

**Description:** Authenticate user and receive an authentication token.

**Authentication:** ❌ Not Required

**Request Body (Required):**

```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Response Status Codes:**

- **200 OK** - User logged in successfully
- **400 Bad Request** - Missing email or password
- **401 Unauthorized** - Invalid email or password
- **500 Internal Server Error** - Server error

**Success Response Example (200):**

```json
{
  "success": true,
  "message": "User logged in successfully",
  "data": {
    "_id": "user_id",
    "fullName": {
      "firstName": "John",
      "lastName": "Doe"
    },
    "email": "john@example.com",
    "phone": "+1234567890",
    "role": "user"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Response Example (401):**

```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

### 4. Get User by ID

**Endpoint:** `GET /users/:id`

**Description:** Fetch a specific user by their ID.

**Authentication:** ✅ Required (Bearer Token)

**URL Parameters:**

- `id` (required) - User MongoDB ObjectId

**Request Headers:**

```json
{
  "Authorization": "Bearer <token>"
}
```

**Response Status Codes:**

- **200 OK** - User fetched successfully
- **401 Unauthorized** - Invalid or missing token
- **404 Not Found** - User not found
- **500 Internal Server Error** - Server error

**Success Response Example (200):**

```json
{
  "success": true,
  "message": "User fetched successfully",
  "data": {
    "_id": "user_id",
    "fullName": {
      "firstName": "John",
      "lastName": "Doe"
    },
    "email": "john@example.com",
    "phone": "+1234567890",
    "role": "user"
  }
}
```

**Error Response Example (404):**

```json
{
  "success": false,
  "message": "User not found"
}
```

---

### 5. Update User

**Endpoint:** `PUT /users/:id`

**Description:** Update user information (profile details).

**Authentication:** ✅ Required (Bearer Token)

**URL Parameters:**

- `id` (required) - User MongoDB ObjectId

**Request Headers:**

```json
{
  "Authorization": "Bearer <token>"
}
```

**Request Body (All fields optional):**

```json
{
  "fullName": {
    "firstName": "string (optional)",
    "lastName": "string (optional)"
  },
  "phone": "string (optional)",
  "profilePicture": "string (optional, URL)",
  "role": "string (optional)"
}
```

**Response Status Codes:**

- **200 OK** - User updated successfully
- **401 Unauthorized** - Invalid or missing token
- **404 Not Found** - User not found
- **500 Internal Server Error** - Server error

**Success Response Example (200):**

```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "_id": "user_id",
    "fullName": {
      "firstName": "Jane",
      "lastName": "Doe"
    },
    "email": "john@example.com",
    "phone": "+9876543210",
    "profilePicture": "https://example.com/pic.jpg",
    "role": "user"
  }
}
```

---

### 6. Delete User

**Endpoint:** `DELETE /users/:id`

**Description:** Delete a user account (Admin only).

**Authentication:** ✅ Required (Bearer Token with Admin Role)

**Authorization:** 🔒 Admin role only

**URL Parameters:**

- `id` (required) - User MongoDB ObjectId

**Request Headers:**

```json
{
  "Authorization": "Bearer <admin_token>"
}
```

**Request Body:** None

**Response Status Codes:**

- **200 OK** - User deleted successfully
- **401 Unauthorized** - Invalid or missing token / insufficient permissions
- **403 Forbidden** - User role is not admin
- **404 Not Found** - User not found
- **500 Internal Server Error** - Server error

**Success Response Example (200):**

```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

**Error Response Example (403):**

```json
{
  "success": false,
  "message": "Insufficient permissions"
}
```

---

## Authentication

All protected endpoints require a valid JWT token in the `Authorization` header:

```
Authorization: Bearer <your_jwt_token>
```

Tokens are received after successful registration or login.

---

## Status Code Summary

| Code | Description                                            |
| ---- | ------------------------------------------------------ |
| 200  | OK - Request successful                                |
| 201  | Created - Resource created successfully                |
| 400  | Bad Request - Missing or invalid parameters            |
| 401  | Unauthorized - Missing or invalid authentication token |
| 403  | Forbidden - Insufficient permissions (e.g., not admin) |
| 404  | Not Found - Resource not found                         |
| 500  | Internal Server Error - Server-side error              |

---

## Error Handling

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Additional error details (if available)"
}
```

---

## Role-Based Access

- **user** - Default role for new users
- **admin** - Can delete users and perform administrative tasks

---

## Usage Examples

### Register a new user

```bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": {
      "firstName": "John",
      "lastName": "Doe"
    },
    "email": "john@example.com",
    "password": "securePassword123",
    "phone": "+1234567890"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securePassword123"
  }'
```

### Get all users (Protected)

```bash
curl -X GET http://localhost:3000/api/users \
  -H "Authorization: Bearer <your_token>"
```

### Update user profile

```bash
curl -X PUT http://localhost:3000/api/users/user_id \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_token>" \
  -d '{
    "phone": "+9876543210",
    "fullName": {
      "firstName": "Jane",
      "lastName": "Doe"
    }
  }'
```

### Delete user (Admin only)

```bash
curl -X DELETE http://localhost:3000/api/users/user_id \
  -H "Authorization: Bearer <admin_token>"
```

---

## Notes

- Passwords are hashed before storage
- Email addresses must be unique
- Token expiration time is configurable in auth middleware
- Protected routes will return 401 if authentication fails
- Admin-only routes will return 403 if user lacks permission
