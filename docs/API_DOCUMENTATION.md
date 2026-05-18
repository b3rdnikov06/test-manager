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
        "time_limit": 5,
        "is_published": 1,
        "attempt_id": 18,
        "is_completed": 1
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
    "message": "Test deleted"
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

## Questions

### POST /questions/:id/answers

**Описание:** добавляет новый ответ к вопросу.  

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
    "text": "Ответ на вопрос",
    "is_correct": true
}
```

**URL параметры:**
| Параметр | Тип     | Описание            |
| -------- | ------- | ------------------- |
| id       | integer | Идентификатор вопроса |

**Поля запроса:**
| Поле     | Тип    | Обязательно | Описание                       |
| -------- | ------ | ----------- | ------------------------------ |
| text    | string | yes         | Текст ответа |
| is_correct | boolen | yes         | Корректный ли вопрос: true/false            |

**Успешный ответ:**
```json
{
    "message": "Answer created",
    "answer_id": 76
}
```

**Ответы об ошибках:**
- Answer text is required  
Status: `400 Bad Request` ("error": "Answer text is required")
- is_correct must be boolean  
Status: `400 Bad Request` ("error": "is_correct must be boolean")
- Cannot modify published test  
Status: `400 Bad Request` ("error": "Cannot modify published test")
- Single choice question can have only one correct answer  
Status: `400 Bad Request` ("error": "Single choice question can have only one correct answer")
- Text question answer must be correct  
Status: `400 Bad Request` ("error": "Text question answer must be correct")
- Text question can have only one answer  
Status: `400 Bad Request` ("error": "Text question can have only one answer")
- Answer already exists for this question  
Status: `400 Bad Request` ("error": "Answer already exists for this question")
- Missing token  
Status: `401 Unauthorized` ("error": "Access denied")
- Invalid token  
Status: `401 Unauthorized` ("error": "Invalid token")
- Access denied  
Status: `403 Forbidden` ("error": "Access denied")
- Question not found  
Status: `404 Not Found` ("error": "Question not found")
- Internal server error  
Status: `500 Internal Server Error` ("error": "Internal server error")

**Бизнес правила:**
- Только преподаватель может добавлять ответы.
- Преподаватель может изменять только собственные тесты.
- Нельзя изменять опубликованный тест.
- Ответы внутри одного вопроса должны быть уникальными.
- Вопрос типа single может содержать только один правильный ответ.
- Вопрос типа text может содержать только один ответ.
- Для вопроса типа text ответ всегда должен быть правильным.

---

### PATCH /questions/:id

**Описание:** изменяет текст вопроса.  

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
    "text": "Новый заголовок вопроса"
}
```

**URL параметры:**
| Параметр | Тип     | Описание              |
| -------- | ------- | --------------------- |
| id       | integer | Идентификатор вопроса |

**Поля запроса:**
| Поле     | Тип    | Обязательно | Описание                       |
| -------- | ------ | ----------- | ------------------------------ |
| text    | string | yes         | Текст вопроса |

**Успешный ответ:**
```json
{
    "message": "Question updated"
}
```

**Ответы об ошибках:**
- Question text is required  
Status: `400 Bad Request` ("error": "Question text is required")
- Cannot modify question while test attempt is active  
Status: `400 Bad Request` ("error": "Cannot modify question while test attempt is active")
- Question already exists  
Status: `400 Bad Request` ("error": "Question already exists")
- Missing token  
Status: `401 Unauthorized` ("error": "Access denied")
- Invalid token  
Status: `401 Unauthorized` ("error": "Invalid token")
- Access denied  
Status: `403 Forbidden` ("error": "Access denied")
- Question not found  
Status: `404 Not Found` ("error": "Question not found")
- Internal server error  
Status: `500 Internal Server Error` ("error": "Internal server error")

**Бизнес правила:**
- Только преподаватель может изменять вопросы.
- Преподаватель может изменять только собственные тесты.
- Изменение вопроса запрещено при наличии активной попытки прохождения теста.
- Внутри одного теста вопросы должны быть уникальными.
- Разрешено изменять только текст вопроса.
- Тип вопроса и структура ответов не изменяются.

---

### DELETE /questions/:id

**Описание:** удаляет вопрос из теста вместе со всеми связанными ответами.  

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
| Параметр | Тип     | Описание              |
| -------- | ------- | --------------------- |
| id       | integer | Идентификатор вопроса |

**Успешный ответ:**
```json
{
    "message": "Question deleted"
}
```

**Ответы об ошибках:**
- Published test cannot be edited  
Status: `400 Bad Request` ("error": "Published test cannot be edited")
- Cannot delete the last question from the test  
Status: `400 Bad Request` ("error": "Cannot delete the last question from the test. Delete the whole test instead.")
- Missing token  
Status: `401 Unauthorized` ("error": "Access denied")
- Invalid token  
Status: `401 Unauthorized` ("error": "Invalid token")
- Access denied  
Status: `403 Forbidden` ("error": "Access denied")
- Question not found  
Status: `404 Not Found` ("error": "Question not found")
- Internal server error  
Status: `500 Internal Server Error` ("error": "Internal server error")

**Бизнес правила:**
- Только преподаватель может удалять вопросы.
- Преподаватель может изменять только собственные тесты.
- Нельзя изменять опубликованный тест.
- Нельзя удалить последний вопрос из теста.
- При удалении вопроса автоматически удаляются все связанные ответы.

---

### DELETE /questions/answers/:id

**Описание:** удаляет ответ на вопрос из теста.  

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
| Параметр | Тип     | Описание              |
| -------- | ------- | --------------------- |
| id       | integer | Идентификатор ответа |

**Успешный ответ:**
```json
{
    "message": "Answer deleted"
}
```

**Ответы об ошибках:**
- Published test cannot be edited  
Status: `400 Bad Request` ("error": "Published test cannot be edited")
- Missing token  
Status: `401 Unauthorized` ("error": "Access denied")
- Invalid token  
Status: `401 Unauthorized` ("error": "Invalid token")
- Access denied  
Status: `403 Forbidden` ("error": "Access denied")
- Answer not found  
Status: `404 Not Found` ("error": "Answer not found")
- Internal server error  
Status: `500 Internal Server Error` ("error": "Internal server error")

**Бизнес правила:**
- Только преподаватель может удалять ответы.
- Преподаватель может изменять только собственные тесты.
- Нельзя изменять ответы опубликованного теста.

---
---

## Attempts

### GET /attempts/:id

**Описание:** возвращает тест с вопросами и вариантами ответов для прохождения попытки.  

**Авторизация:** требуется Bearer Token.  

**Роль:** доступ у авторизованных пользователей.  

**Заголовки:**
```json
{
    "Authorization": "Bearer jwt_token"
}
```

**Тело запроса:** отсутствует.  

**URL параметры:**
| Параметр | Тип     | Описание              |
| -------- | ------- | --------------------- |
| id       | integer | Идентификатор попытки |

**Успешный ответ:**
```json
{
    "attempt_id": "9",
    "test": {
        "id": 11,
        "title": "Тест проверки и того и того",
        "description": null,
        "time_limit": 30
    },
    "questions": [
        {
            "id": 46,
            "text": "первый вопрос",
            "type": "single",
            "order_index": 1,
            "answers": [
                {
                    "id": 71,
                    "text": "Второй"
                },
                {
                    "id": 66,
                    "text": "Первый"
                }
            ]
        }
    ]
}
```

**Ответы об ошибках:**
- Test not found  
Status: `404 Not Found` ("error": "Test not found")
- Attempt already completed  
Status: `400 Bad Request`
- Missing token  
Status: `401 Unauthorized` ("error": "Access denied")
- Invalid token  
Status: `401 Unauthorized` ("error": "Invalid token")
- Access denied  
Status: `403 Forbidden`
- Internal server error  
Status: `500 Internal Server Error` ("error": "Internal server error")

**Бизнес правила:**
- Пользователь может получать только собственную попытку.
- Endpoint доступен только для незавершенных попыток.
- Для вопросов типа text варианты ответов не отображаются.
- Правильные ответы скрыты от пользователя.
- Вопросы сортируются по order_index.

---

### POST /attempts/start

**Описание:** создает новую попытку прохождения теста.  

**Авторизация:** требуется Bearer Token.  

**Роль:** доступ у авторизованных пользователей.  

**Заголовки:**
```json
{
    "Authorization": "Bearer jwt_token"
}
```

**Тело запроса:**
```json
{
    "test_id": 11
}
```

**Поля запроса:**
| Поле     | Тип    | Обязательно | Описание                       |
| -------- | ------ | ----------- | ------------------------------ |
| test_id    | integer | yes         | id теста, который нужно начать |

**Успешный ответ:**
```json
{
    "message": "Attempt started",
    "attempt_id": 9
}
```

**Ответы об ошибках:**
- Test not found or not published  
Status: `404 Not Found` ("error": "Test not found or not published")
- You already started this test  
Status: `400 Bad Request` ("error": "You already started this test")
- Missing token  
Status: `401 Unauthorized` ("error": "Access denied")
- Invalid token  
Status: `401 Unauthorized` ("error": "Invalid token")
- Internal server error  
Status: `500 Internal Server Error` ("error": "Internal server error")

**Бизнес правила:**
- Попытку можно создать только для опубликованного теста.
- Один пользователь может иметь только одну попытку для одного теста.
- Время начала попытки фиксируется автоматически.

---

### POST /auth/register

### POST /attempts/:id/answer

**Описание:** сохраняет ответ пользователя на вопрос.  

**Авторизация:** требуется Bearer Token.  

**Роль:** доступ у авторизованных пользователей.  

**Заголовки:**
```json
{
    "Authorization": "Bearer jwt_token"
}
```

**Тело запроса:**
```json
{
    "question_id": 26,
    "answer_id": 36
}
```

**URL параметры:**
| Параметр | Тип     | Описание              |
| -------- | ------- | --------------------- |
| id       | integer | Идентификатор попытки |

**Поля запроса:**
| Поле     | Тип    | Обязательно | Описание                       |
| -------- | ------ | ----------- | ------------------------------ |
| question_id    | integer | yes         | id вопроса |
| answer_id | integer | yes         | id ответа           |

**Успешный ответ:**
```json
{
    "message": "Answer saved"
}
```

**Ответы об ошибках:**
- question_id required  
Status: `400 Bad Request`
- Answer required  
Status: `400 Bad Request`
- Choose answer OR text, not both  
Status: `400 Bad Request`
- Text answer cannot be empty  
Status: `400 Bad Request`
- Invalid question id  
Status: `400 Bad Request`
- Invalid answer id  
Status: `400 Bad Request`
- Text answer allowed only for text questions  
Status: `400 Bad Request`
- Text question cannot use answer_id  
Status: `400 Bad Request`
- Text answer required  
Status: `400 Bad Request`
- Text answer already submitted  
Status: `400 Bad Request`
- Only one answer allowed for single question  
Status: `400 Bad Request`
- Answer already submitted  
Status: `400 Bad Request`
- Attempt already completed  
Status: `400 Bad Request`
- Missing token  
Status: `401 Unauthorized` ("error": "Access denied")
- Invalid token  
Status: `401 Unauthorized` ("error": "Invalid token")
- Access denied  
Status: `403 Forbidden`
- Internal server error  
Status: `500 Internal Server Error` ("error": "Internal server error")

**Бизнес правила:**
- Пользователь может отвечать только в собственной попытке.
- Ответы можно отправлять только в незавершенной попытке.
- Для вопроса типа single разрешен только один ответ.
- Для вопроса типа multiple разрешено несколько ответов.
- Для вопроса типа text разрешен только текстовый ответ.
- Для вопросов типов single и multiple запрещены text_answer.
- Для вопросов типа text запрещен answer_id.
- Повторная отправка одинакового ответа запрещена.

---

### POST /attempts/:id/submit

**Описание:** завершает попытку прохождения теста и рассчитывает результат.  

**Авторизация:** требуется Bearer Token.  

**Роль:** доступ у авторизованных пользователей.  

**Заголовки:**
```json
{
    "Authorization": "Bearer jwt_token"
}
```

**Тело запроса:** отсутствует.  

**URL параметры:**
| Параметр | Тип     | Описание              |
| -------- | ------- | --------------------- |
| id       | integer | Идентификатор попытки |

**Успешный ответ:**
```json
{
    "message": "Test completed",
    "score": 2,
    "total": 5,
    "percentage": 40
}
```

**Ответы об ошибках:**
- Test already completed  
Status: `400 Bad Request` ("error": "Test already completed")
- Missing token  
Status: `401 Unauthorized` ("error": "Access denied")
- Invalid token  
Status: `401 Unauthorized` ("error": "Invalid token")
- Access denied  
Status: `403 Forbidden`
- Internal server error  
Status: `500 Internal Server Error` ("error": "Internal server error")

**Бизнес правила:**
- Пользователь может завершить только собственную попытку.
- После завершения попытки ответы больше нельзя изменять.
- Результат теста рассчитывается автоматически.
- После завершения вычисляются score, total и percentage.
- Повторное завершение попытки запрещено.

---
---

## Results

### GET /results/:attempt_id

**Описание:** возвращает подробный результат попытки прохождения теста.  

**Авторизация:** требуется Bearer Token.  

**Роль:** доступ у владельца попытки и teacher.  

**Заголовки:**
```json
{
    "Authorization": "Bearer jwt_token"
}
```

**Тело запроса:** отсутствует.  

**URL параметры:**
| Параметр   | Тип     | Описание              |
| ---------- | ------- | --------------------- |
| attempt_id | integer | Идентификатор попытки |

**Успешный ответ:**
```json
{
    "attempt_id": "9",
    "user_id": 12,
    "test_id": 11,
    "title": "Заголовок текста",
    "score": 2,
    "total": 5,
    "percentage": 40,
    "questions": [
        {
            "question_id": 46,
            "question_text": "первый вопрос",
            "type": "single",
            "answers": [
                {
                    "answer_id": 71,
                    "text": "Второй",
                    "is_correct": 0,
                    "selected": false
                },
                {
                    "answer_id": 66,
                    "text": "Первый",
                    "is_correct": 1,
                    "selected": true
                }
            ]
        }
    ]
}
```

**Ответы об ошибках:**
- Test not completed yet  
Status: `400 Bad Request` ("error": "Test not completed yet")
- Missing token  
Status: `401 Unauthorized` ("error": "Access denied")
- Invalid token  
Status: `401 Unauthorized` ("error": "Invalid token")
- Access denied  
Status: `403 Forbidden` ("error": "Access denied")
- Attempt not found  
Status: `404 Not Found` ("error": "Attempt not found")
- Result not found  
Status: `404 Not Found` ("error": "Result not found")
- Internal server error  
Status: `500 Internal Server Error` ("error": "Internal server error")

**Бизнес правила:**
- Студент может просматривать только собственные результаты.
- Преподаватель может просматривать любые результаты.
- Результат доступен только после завершения попытки.
- Для вопросов типа text отображается text_answer.
- Для вопросов типов single и multiple отображается selected.
- В ответе отображаются правильные ответы.
- Результат содержит score, total и percentage.

---

### GET /results/tests/:id

**Описание:** возвращает результаты всех попыток прохождения определенного теста.  

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
    "test_id": 2,
    "title": "Проверка на знание ног у животных и млекопитающих",
    "attempts": [
        {
            "attempt_id": 6,
            "user_id": 12,
            "started_at": "2026-05-12T20:19:42.000Z",
            "finished_at": "2026-05-12T20:21:54.000Z",
            "score": 3,
            "total": 3,
            "percentage": 100
        }
    ]
}
```

**Ответы об ошибках:**
-  Missing token  
Status: `401 Unauthorized` ("error": "Access denied")
-  Invalid token  
Status: `401 Unauthorized` ("error": "Invalid token")
-  Access denied  
Status: `403 Forbidden` ("error": "Access denied")
-  Test not found  
Status: `404 Not Found` ("error": "Test not found")
-  Internal server error  
Status: `500 Internal Server Error` ("error": "Internal server error")

**Бизнес правила:**
- Endpoint доступен только преподавателям.
- Преподаватель может просматривать результаты любых тестов.
- В ответе отображаются все попытки прохождения теста.
- Для каждой попытки отображаются score, total и percentage.
- Попытки сортируются по started_at в порядке убывания.

---

### GET /results/student/:id

**Описание:** возвращает ведомость студента со всеми результатами тестов.  

**Авторизация:** требуется Bearer Token.  

**Роль:** доступ у владельца ведомости и teacher.  

**Headers:**
```json
{
    "Authorization": "Bearer jwt_token"
}
```

**Тело запроса:** отсутствует.  

**URL параметры:**
| Параметр | Тип     | Описание                   |
| -------- | ------- | -------------------------- |
| id       | integer | Идентификатор пользователя |

**Успешный ответ:**
```json
{
    "user_id": 12,
    "email": "three@mail.ru",
    "role": "student",
    "attempts": [
        {
            "attempt_id": 9,
            "test_id": 11,
            "title": "Тест проверки и того и того",
            "started_at": "2026-05-14T11:24:37.000Z",
            "finished_at": "2026-05-14T11:43:47.000Z",
            "duration_minutes": 19,
            "score": 2,
            "total": 5,
            "percentage": 40
        }
    ]
}
```

**Ответы об ошибках:**
- Missing token  
Status: `401 Unauthorized` ("error": "Access denied")
- Invalid token  
Status: `401 Unauthorized` ("error": "Invalid token")
- Access denied  
Status: `403 Forbidden` ("error": "Access denied")
- User not found  
Status: `404 Not Found` ("error": "User not found")
- Internal server error  
Status: `500 Internal Server Error` ("error": "Internal server error")

**Бизнес правила:**
- Студент может просматривать только собственную ведомость.
- Преподаватель может просматривать ведомость любого студента.
- Ведомость содержит только завершенные попытки.
- Для каждой попытки отображаются:
    название теста,
    score,
    total,
    percentage,
    время начала и завершения,
    duration_minutes.
- Попытки сортируются по started_at в порядке убывания.

---
---

## Users

### GET /users/students

**Описание:** получение списка всех студентов.  

**Авторизация:** требуется Bearer Token.  

**Роль:** только teacher.  

**Заголовки:**
```json
{
    "Authorization": "Bearer jwt_token"
}
```

**Тело запроса:** отсутствует.  

**Успешный ответ:**
```json
[
  {
    "id": 2,
    "email": "student@test.com"
  }
]
```

**Ответы об ошибках:**
-  Missing token  
Status: `401 Unauthorized` ("error": "Access denied")
-  Invalid token  
Status: `401 Unauthorized` ("error": "Invalid token")
-  Access denied  
Status: `403 Forbidden` ("error": "Access denied")
-  Internal server error  
Status: `500 Internal Server Error` ("error": "Internal server error")

**Бизнес правила:**
- Только преподаватель может просматривать список студентов.
- Возвращаются только пользователи с ролью student.