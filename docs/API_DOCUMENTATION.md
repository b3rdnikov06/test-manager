# API Documentation

## Auth ( Authentication )

### POST /auth/register

**Description:** создает нового пользователя в системе.  

**Authorization:** не требуется.  

**Roles:** доступ у всех пользователей.  

**Request Body:**
``` JSON
{  
    "email": "set@mail.ru",  
    "password": "12345678",  
    "role": "student"  
}  
```

**Request Fields:**
| Field | Type | Required | Description |
| ------- | ------- | ------- | ------- |
| email | string | yes | User email |
| password | string | yes | User password |
| role | string | yes | User role (student or teacher) |

**Successful Response:**  
Status: 200 OK
``` JSON
{
    "message": "User created"
}
```

**Error Responses:**  
1. Missing required fields  
Status: 400 Bad Request ("error": "All fields are required")
2. Password too short  
Status: 400 Bad Request ("error": "Password must contain at least 8 characters")
3. Invalid email  
Status: 400 Bad Request ("error": "Invalid email")
4. Invalid role  
Status: 400 Bad Request ("error": "Invalid role")
5. Email already exists  
Status: 400 Bad Request ("error": "Email already exists")
6. Internal server error  
Status: 500 Internal Server Error ("error": "Internal server error")

**Business Rules:**
* Пароль должен содержать не менее 8 символов.
* Допускаются только роли студента и преподавателя.
* Электронная почта должна быть уникальной.

### POST /auth/login

...

---

## Tests

### GET /tests

...

### POST /tests

...