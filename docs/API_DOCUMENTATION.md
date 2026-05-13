# API Documentation

## Auth ( Authentication )

### POST /auth/register

**Описание:** создает нового пользователя в системе.  

**Авторизация:** не требуется.  

**Роль:** доступ у всех пользователей.  

**Тело запроса:**
``` json
{  
    "email": "set@mail.ru",  
    "password": "12345678",  
    "role": "student"  
}  
```

**Поля запроса:**
| Поле | Тип | Обязательно | Описание |
| ------- | ------- | ------- | ------- |
| email | string | yes | Электронная почта пользователя |
| password | string | yes | Пароль пользователя |
| role | string | yes | Роль пользователя (student или teacher) |

**Успешный ответ:**  
Status: `200 OK`
``` json
{
    "message": "User created"
}
```

**Ответы об ошибках:**  
- Missing required fields  
Status: `400 Bad Request` ("error": "All fields are required")
- Password too short  
Status: `400 Bad Request` ("error": "Password must contain at least 8 characters")
- Invalid email  
Status: `400 Bad Request` ("error": "Invalid email")
- Invalid role  
Status: `400 Bad Request` ("error": "Invalid role")
- Email already exists  
Status: `400 Bad Request` ("error": "Email already exists")
- Internal server error  
Status: `500 Internal Server Error` ("error": "Internal server error")

**Бизнес правила:**
- Пароль должен содержать не менее 8 символов.
- Допускаются только роли студента и преподавателя.
- Электронная почта должна быть уникальной.

### POST /auth/login

...

---

## Tests

### GET /tests

...

### POST /tests

...