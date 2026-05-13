# API Documentation

## Auth ( Authentication )

### POST /auth/register

Description: создает нового пользователя в системе.  
Authorization: не требуется.  
Roles: доступ у всех пользователей.  
Request Body: {  
    "email": "set@mail.ru",  
    "password": "12345678",  
    "role": "student"  
}  
Request Fields:  
| Field | Type | Required | Description |
| ------- | ------- | ------- | ------- |
| email | string | yes | User email |
| password | string | yes | User password |
| role | string | yes | User role (student or teacher) |  
Successful Response:  
Status: 200 OK
``` JSON
{
    "message": "User created"
}
```
Error Responses:  
Missing required fields  
Status: 400 Bad Request
``` JSON
{
    "error": "All fields are required"
}
```
Password too short  
Status: 400 Bad Request
``` JSON
{
    "error": "Password must contain at least 8 characters"
}
``` 
Invalid email  
Status: 400 Bad Request
``` JSON
{
    "error": "Invalid email"
}
```
Invalid role  
Status: 400 Bad Request
``` JSON
{
    "error": "Invalid role"
}
```
Email already exists  
Status: 400 Bad Request
``` JSON
{
    "error": "Email already exists"
}
```
Internal server error  
Status: 500 Internal Server Error
``` JSON
{
    "error": "Internal server error"
}
```

### POST /auth/login

...

---

## Tests

### GET /tests

...

### POST /tests

...