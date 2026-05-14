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

---

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

---

### POST /auth/logout

**Описание:** завершает текущую пользовательскую сессию и делает JWT токен недействительным.  

**Авторизация:** требуется Bearer Token.  

**Роль:** доступ у всех авторизованных пользователей.  

**Заголовки:**
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
    "message": "Logged out"
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
---

## Tests

### GET /tests

**Описание:** возвращает список всех опубликованных тестов.  

**Авторизация:** требуется Bearer Token.  

**Роль:** доступ у всех пользователей.  

**Заголовки:**
```json
{
    "Authorization": "Bearer jwt_token"
}
```

**Тело запроса:** отсутствует.  

**Успешный ответ:**  
Status: `200 OK`
```json
[
    {
        "id": 1,
        "title": "Java Basics",
        "description": "Test for Java knowledge",
        "author_id": 3,
        "time_limit": 5,
        "attempts_limit": 1,
        "is_published": 1,
        "created_at": "2026-05-11T16:16:26.000Z"
    }
]
```

**Ответы об ошибках:**
- Missing token  
Status: `401 Unauthorized` ("error": "Access denied")
- Invalid token  
Status: `401 Unauthorized` ("error": "Invalid token")
- Internal server error  
Status: `500 Internal Server Error` ("error": "Internal server error")

**Бизнес правила:**
- Пользователь получает только опубликованные тесты.
- Неопубликованные тесты скрыты от студентов.

---

### GET /tests/teacher

**Описание:** возвращает список всех тестов, созданных преподавателем.  

**Авторизация:** требуется Bearer Token.  

**Роль:** только teacher.  

**Заголовоки:**
```json
{
    "Authorization": "Bearer jwt_token"
}
```

**Тело запроса:** отсутствует.  

**Успешный ответ:**  
Status: `200 OK`
```json
[
    {
        "id": 10,
        "title": "Тест для проверки и того и того",
        "description": null,
        "time_limit": 30,
        "attempts_limit": 1,
        "is_published": 1,
        "created_at": "2026-05-13T09:14:29.000Z"
    }
]

```

**Ответы об ошибках:**
- Missing token
Status: `401 Unauthorized` ("error": "Access denied")
- Invalid token  
Status: `401 Unauthorized` ("error": "Invalid token")
- Access denied  
Status: `403 Forbidden` ("error": "Access denied")
- Internal server error  
Status: `500 Internal Server Error` ("error": "Internal server error")

**Бизнес правила:**
- Преподаватель получает только собственные тесты.
- Endpoint недоступен студентам.
- В ответе отображаются как опубликованные, так и неопубликованные тесты.

---

### GET /tests/:id/full

**Описание:** возвращает полную информацию о тесте, включая вопросы и ответы.  

**Авторизация:** требуется Bearer Token.  

**Роль:** только teacher.  

**Headers:**
```json
{
    "Authorization": "Bearer jwt_token"
}
```

**Тело запроса:** отсутствует.  

**URL параметры:**
| Параметр | Тип     | Описание            |
| -------- | ------- | ------------------- |
| id       | integer | Идентификатор теста |

**Успешный ответ:**
Status: `200 OK`
```json
[
    {
        "id": 35,
        "text": "Первый вопрос",
        "type": "single",
        "answers": [
            {
                "id": 50,
                "text": "Второй",
                "is_correct": 0
            },
            {
                "id": 45,
                "text": "Первый",
                "is_correct": 1
            }
        ]
    }
]
```

**Ответы об ошибках:**
- Missing token
Status: `401 Unauthorized` ("error": "Access denied")
- Invalid token  
Status: `401 Unauthorized` ("error": "Invalid token")
- Access denied  
Status: `403 Forbidden` ("error": "Access denied")
- Test not found  
Status: `404 Not Found` ("error": "Test not found")
- Internal server error  
Status: `500 Internal Server Error` ("error": "Internal server error")

**Бизнес правила:**
- Endpoint доступен только преподавателям.
- В ответе отображаются вопросы теста и все варианты ответов.
- Для ответов отображается поле is_correct.
- Вопросы сортируются по order_index.

---

### POST /tests

**Описание:** создает новый тест в системе.  

**Авторизация:** требуется Bearer Token.  

**Роль:** только teacher.  

**Заголовки:**
```json
{
    "Authorization": "Bearer jwt_token"
}
```

**Тело запроса:**
```json
{
    "title": "Заголовк теста",
    "description": "Описание",
    "time_limit": "30"
}
```

**Поля запроса:**
| Поле     | Тип    | Обязательно | Описание                       |
| -------- | ------ | ----------- | ------------------------------ |
| title    | string | yes         | Заголовок теста |
| description | string | no         | Описание теста            |
| time_limit | string | yes         | Отведенное время на решение теста            |

**Успешный ответ:**
```json
{
    "message": "Test created",
    "test_id": 11
}
```

**Ответы об ошибках:**
- Missing title  
Status: `400 Bad Request` ("error": "Title is required")
- Missing time_limit  
Status: `400 Bad Request` ("error": "time_limit is required")
- Invalid time limit  
Status: `400 Bad Request` ("error": "The test should take between 5 and 30 minutes to complete.")
- Test with this title already exists  
Status: `400 Bad Request` ("error": "Test with this title already exists")
- Missing token  
Status: `401 Unauthorized` ("error": "Access denied")
- Invalid token  
Status: `401 Unauthorized` ("error": "Invalid token")
- Access denied  
Status: `403 Forbidden` ("error": "Access denied")
- Internal server error  
Status: `500 Internal Server Error` ("error": "Internal server error")

**Бизнес правила:**
- Только преподаватель может создавать тесты.
- Название теста должно быть уникальным.
- Время прохождения теста должно быть от 5 до 30 минут.
- description автоматически преобразуется в null, если содержит только пробелы.
- Автор теста определяется по JWT токену.

---

### POST /tests/:id/questions

**Описание:** добавляет новый вопрос в тест.  

**Авторизация:** требуется Bearer Token.  

**Роль:** только teacher.  

**Заголовки:**
```json
{
    "Authorization": "Bearer jwt_token"
}
```

**Тело запроса:**
```json
{
    "text": "Вопрос",
    "type": "single"
}
```

**URL параметры:**
| Параметр | Тип     | Описание            |
| -------- | ------- | ------------------- |
| id       | integer | Идентификатор теста |

**Поля запроса:**
| Поле     | Тип    | Обязательно | Описание                       |
| -------- | ------ | ----------- | ------------------------------ |
| text    | string | yes         | Текст вопроса |
| type | string | yes         | Тип вопроса (single/multiple,text)            |

**Успешный ответ:**
```json
{
    "message": "Question created",
    "question_id": 46,
    "order_index": 1
}
```

**Ответы об ошибках:**
- Question text is required  
Status: `400 Bad Request` ("error": "Question text is required")
- Invalid question type  
Status: `400 Bad Request` ("error": "Invalid question type")
- Cannot modify published test  
Status: `400 Bad Request` ("error": "Cannot modify published test")
- Question already exists in this test  
Status: `400 Bad Request` ("error": "Question already exists in this test")
- Missing token  
Status: `401 Unauthorized` ("error": "Access denied")
- Invalid token  
Status: `401 Unauthorized` ("error": "Invalid token")
- Test not found or access denied  
Status: `403 Forbidden` ("error": "Test not found or access denied")
- Internal server error  
Status: `500 Internal Server Error` ("error": "Internal server error")

**Бизнес правила:**
- Только преподаватель может добавлять вопросы.
- Вопрос можно добавить только в собственный тест.
- Нельзя изменять опубликованный тест.
- Текст вопроса должен быть уникальным внутри теста.
- Допустимые типы вопросов: single, multiple, text.
- Порядок вопросов (order_index) назначается автоматически.

---

### PATCH /tests/:id/publish

**Описание:** публикует тест и делает его доступным для прохождения студентами.  

**Авторизация:** требуется Bearer Token.  

**Роль:** только teacher.  

**Заголовки:**
```json
{
    "Authorization": "Bearer jwt_token"
}
```

**Тело запроса:** отсутствует.  

**URL параметры:**
| Параметр | Тип     | Описание            |
| -------- | ------- | ------------------- |
| id       | integer | Идентификатор теста |

**Успешный ответ:**  
```json
{
    "message": "Test published successfully"
}
```

**Ответы об ошибках:**
- Missing token  
Status: `401 Unauthorized` ("error": "Access denied")
- Invalid token  
Status: `401 Unauthorized` ("error": "Invalid token")
- Access denied  
Status: `403 Forbidden` ("error": "Access denied")
- Test not found  
Status: `404 Not Found` ("error": "Test not found")
- Test already published  
Status: `400 Bad Request` ("error": "Test already published")
- Test must contain at least 5 questions  
Status: `400 Bad Request`
- Test cannot contain more than 20 questions  
Status: `400 Bad Request`
- Question must contain at least 2 answers  
Status: `400 Bad Request`
- Single question must have exactly one correct answer  
Status: `400 Bad Request`
- Multiple question must have at least one correct answer  
Status: `400 Bad Request`
- Text question must have exactly one answer  
Status: `400 Bad Request`
- Text question answer must be correct  
Status: `400 Bad Request`
- Internal server error  
Status: `500 Internal Server Error` ("error": "Internal server error")

**Бизнес правила:**
- Только преподаватель может публиковать тесты.
- Опубликованный тест становится доступным студентам.
- Тест должен содержать от 5 до 20 вопросов.
- Закрытые вопросы должны содержать минимум 2 варианта ответа.
- Вопрос типа single должен содержать ровно один правильный ответ.
- Вопрос типа multiple должен содержать минимум один правильный ответ.
- Вопрос типа text должен содержать ровно один правильный ответ.
- Повторная публикация теста запрещена.

---

### PATCH /tests/:id

**Описание:** обновляет основную информацию о тесте.  

**Авторизация:** требуется Bearer Token.  

**Роль:** только teacher.  

**Заголовки:**
```json
{
    "Authorization": "Bearer jwt_token"
}
```

**Тело запроса:**
```json
{
    "title": "Новый заголовок",
    "description": "Новое описание",
    "time_limit": 30
}
```

**URL параметры:**
| Параметр | Тип     | Описание            |
| -------- | ------- | ------------------- |
| id       | integer | Идентификатор теста |

**Поля запроса:**
| Поле     | Тип    | Обязательно | Описание                       |
| -------- | ------ | ----------- | ------------------------------ |
| title    | string | yes         | Заголовок теста |
| description | string | no         | Описание теста            |
| time_limit | integer | yes         | Отведенное время на решение теста            |

**Успешный ответ:** 
```json 
{
    "message": "Test updated"
}
```

**Ответы об ошибках:**
- Title is required  
Status: `400 Bad Request` ("error": "Title is required")
- time_limit is required  
Status: `400 Bad Request` ("error": "time_limit is required")
- Invalid time limit  
Status: `400 Bad Request` ("error": "The test should take between 5 and 30 minutes to complete")
- Test with active attempts cannot be edited  
Status: `400 Bad Request` ("error": "Test with active attempts cannot be edited")
- Test with this title already exists  
Status: `400 Bad Reques`t ("error": "Test with this title already exists")
- Missing token  
Status: `401 Unauthorized` ("error": "Access denied")
- Invalid token  
Status: `401 Unauthorized` ("error": "Invalid token")
- Access denied  
Status: `403 Forbidden` ("error": "Access denied")
- Test not found  
Status: `404 Not Found` ("error": "Test not found")
- Internal server error  
Status: `500 Internal Server Error` ("error": "Internal server error")

**Бизнес правила:**
- Только преподаватель может изменять тест.
- Преподаватель может изменять только собственные тесты.
- Название теста должно быть уникальным.
- Время прохождения теста должно быть от 5 до 30 минут.
- Нельзя изменять тест при наличии активных попыток прохождения.
- Разрешено изменять только metadata теста: title, description и time_limit.
- description автоматически преобразуется в null, если содержит только пробелы.

---

### DELETE /tests/:id

**Описание:** удаляет тест из системы вместе со всеми вопросами и ответами.  

**Авторизация:** требуется Bearer Token.  

**Роль:** только teacher.  

**Headers:**
```json
{
    "Authorization": "Bearer jwt_token"
}
```

**Тело запроса:** отсутствует.  

**URL параметры:**
| Параметр | Тип     | Описание            |
| -------- | ------- | ------------------- |
| id       | integer | Идентификатор теста |

**Успешный ответ:**
```json
{
    "message": "Question deleted"
}
```

**Ответы об ошибках:**
- Test with attempts cannot be deleted
Status: `400 Bad Request` ("error": "Test with attempts cannot be deleted")
- Missing token
Status: `401 Unauthorized` ("error": "Access denied")
- Invalid token
Status: `401 Unauthorized` ("error": "Invalid token")
- Access denied
Status: `403 Forbidden` ("error": "Access denied")
- Test not found
Status: `404 Not Found` ("error": "Test not found")
- Internal server error
Status: `500 Internal Server Error` ("error": "Internal server error")

**Бизнес правила:**
- Только преподаватель может удалять тесты.
- Преподаватель может удалять только собственные тесты.
- Тест нельзя удалить, если существуют попытки его прохождения.
- При удалении теста автоматически удаляются все связанные вопросы и ответы.
- Удаление опубликованных тестов разрешено только при отсутствии attempts.

---
---