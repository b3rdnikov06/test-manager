# API Documentation

## Auth ( Authentication )

### POST /auth/register

**Описание:** создает нового пользователя в системе.  

**Авторизация:** не требуется.  

**Роль:** доступ у всех пользователей.  

**Тело запроса:**
```json
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
```json
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

**Описание:** авторизует пользователя в системе и выдает JWT токен.  

**Авторизация:** не требуется.  

**Роль:** доступ у всех пользователей.  

**Тело запроса:**
```json
{
    "email": "set@mail.ru",
    "password": "12345678"
}
```

**Поля запроса:**
| Поле     | Тип    | Обязательно | Описание                       |
| -------- | ------ | ----------- | ------------------------------ |
| email    | string | yes         | Электронная почта пользователя |
| password | string | yes         | Пароль пользователя            |

**Успешный ответ:**  
Status: `200 OK`
```json
{
    "token": "jwt_token"
}
```

**Ответы об ошибках:**
- User not found
Status: `401 Unauthorized` ("error": "User not found")
- Wrong password
Status: `401 Unauthorized` ("error": "Wrong password")
- Internal server error
Status: `500 Internal Server Error` ("error": "Internal server error")

**Бизнес правила:**
- Авторизация выполняется по email и паролю.
- После успешной авторизации сервер выдает JWT токен.
- JWT токен необходимо передавать в Authorization header для доступа к защищенным endpoints.

### POST /auth/logout

**Описание:** завершает текущую пользовательскую сессию и делает JWT токен недействительным.  

**Авторизация:** требуется Bearer Token.  

**Роль:** доступ у всех авторизованных пользователей.  

**Заголовок:**
```json
{
    "Authorization": "Bearer jwt_token"
}
```

**Тело запроса:** отсутствует.  

**Успешный ответ:**  
Status: `200 OK`
```json
{
    "token": "jwt_token"
}
```

**Ответы об ошибках:**
- Missing token
Status: `401 Unauthorized` ("error": "Access denied")
- Invalid token
Status: `401 Unauthorized` ("error": "Invalid token")
- Internal server error
Status: `500 Internal Server Error` ("error": "Internal server error")

**Бизнес правила:**
- Endpoint доступен только авторизованным пользователям.
- При logout значение token_version увеличивается на 1.
- Все ранее выданные JWT токены пользователя становятся недействительными.

---

## Tests

### GET /tests

...

### POST /tests

...