# UI & API Test Automation

Проект содержит автоматизированные UI- и API-тесты для собственной платформы тестирования.

## Stack

- Java
- Selenium WebDriver
- Rest Assured
- TestNG
- Maven

## UI Test Scenarios

- Successful student login
- Invalid password
- Invalid login
- Student registration
- Teacher registration
- Teacher creates a test
- Teacher creates and publishes a test with questions

## API Test Scenarios

### Authentication
- Successful login
- Login with incorrect password
- Login with unregistered email
- Login with empty credentials

### Registration
- Successful student registration
- Successful teacher registration
- Duplicate registration
- Registration with invalid email

### Test Management
- Unauthorized access to test results
- Create test
- Create test with empty title
- Create test and add a question
- Create test, add questions and answers, then publish
- View test results
- Get full test information

## Project Structure

```text
src/test/java
├── TestAPI
│   ├── clientsAPI
│   ├── pojo
│   ├── Specs
│   ├── testdata
│   └── TestsAPI
│
└── TestUI
    ├── pages
    └── tests
```

## Run Tests

Run all tests:

```bash
mvn test
```

Or execute individual TestNG classes directly from IntelliJ IDEA.