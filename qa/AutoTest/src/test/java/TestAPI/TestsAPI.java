package TestAPI;

import TestAPI.clientsAPI.LoginUser;
import TestAPI.pojo.AuthReq;
import io.restassured.RestAssured;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

import static TestAPI.testdata.*;
import static TestAPI.testdata.getRegisterJson;
import static org.hamcrest.Matchers.containsString;

public class TestsAPI {

    @BeforeMethod
    public void setUp() {
        Specs.installSpec(Specs.requestSpec(URL, PORT));
    }

    @Test
    public void successfulLogin() {

        AuthReq authReq = new AuthReq(VALID_EMAIL, VALID_PASSWORD);

        RestAssured
                .given()
                    .body(authReq)
                .when()
                    .post("/auth/login")
                .then()
                    .statusCode(200);
    }

    @Test
    public void incorrectPasswordToValidEmail() {
        AuthReq authReq = new AuthReq(VALID_EMAIL, INCORRECT_PASSWORD);

        RestAssured
                .given()
                    .body(authReq)
                .when()
                    .post("/auth/login")
                .then()
                    .statusCode(401)
                    .body(containsString("Wrong password"));
    }

    @Test
    public void userNotFound() {
        AuthReq authReq = new AuthReq(UNRECORDER_EMAIL, VALID_PASSWORD);

        RestAssured
                .given()
                    .body(authReq)
                .when()
                    .post("/auth/login")
                .then()
                    .statusCode(401)
                    .body(containsString("User not found"));
    }

    @Test
    public void emptyFieldsUserNotFound() {
        AuthReq authReq = new AuthReq("", "");

        RestAssured
                .given()
                    .body(authReq)
                .when()
                    .post("/auth/login")
                .then()
                    .statusCode(401)
                    .body(containsString("User not found"));
    }

    @Test
    public void successfulRegisterStudent() {

        RestAssured
                .given()
                    .body(getRegisterJson("student"))
                .when()
                    .post("/auth/register")
                .then()
                    .statusCode(200)
                    .body(containsString("User created"));
    }

    @Test
    public void successfulRegisterTeacher() {

        RestAssured
                .given()
                    .body(getRegisterJson("teacher"))
                .when()
                    .post("/auth/register")
                .then()
                    .statusCode(200)
                    .body(containsString("User created"));
    }

    @Test
    public void reRegisterTeacher() {

        String data = getRegisterJson("teacher");

        RestAssured
                .given()
                    .body(data)
                .when()
                .   post("/auth/register")
                .then()
                    .statusCode(200)
                    .body(containsString("User created"));

        RestAssured
                .given()
                    .body(data)
                .when()
                    .post("/auth/register")
                .then()
                    .statusCode(400)
                    .body(containsString("Email already exists"));
    }

    @Test
    public void incorrectRegisterTeacher() {

        RestAssured
                .given()
                    .body(getIncorrectRegisterJson("teacher"))
                .when()
                    .post("/auth/register")
                .then()
                    .statusCode(400)
                    .body(containsString("Invalid email"));
    }

    @Test
    public void viewResultsTestUnauthorizedAccount() {

        RestAssured
                .given()
                .when()
                    .get("/results/tests/1")
                .then()
                    .statusCode(401);
    }

    @Test
    public void createTestAT() {

        String tokenResponse = LoginUser.loginUser(VALID_EMAIL, VALID_PASSWORD);

        RestAssured
                .given()
                    .body(getAttributeCreateTestJson(true))
                    .headers("Authorization", "Bearer " + tokenResponse)
                .when()
                    .post("/tests")
                .then()
                    .statusCode(201);
    }

    @Test
    public void createTestEmptyTitleAT() {

        String tokenResponse = LoginUser.loginUser(VALID_EMAIL, VALID_PASSWORD);

        RestAssured
                .given()
                    .body(getAttributeCreateTestJson(false))
                    .headers("Authorization", "Bearer " + tokenResponse)
                .when()
                    .post("/tests")
                .then()
                    .statusCode(400);
    }

    @Test
    public void createTestAndQuestionAT() {

        String tokenResponse = LoginUser.loginUser(VALID_EMAIL, VALID_PASSWORD);

        Integer id = RestAssured
                .given()
                    .body(getAttributeCreateTestJson(true))
                    .headers("Authorization", "Bearer " + tokenResponse)
                .when()
                    .post("/tests")
                .then()
                    .statusCode(201).extract().response().path("test_id");

        RestAssured
                .given()
                    .body(getAttributeQuestionJson())
                    .headers("Authorization", "Bearer " + tokenResponse)
                .when()
                    .post("/tests/" + id + "/questions")
                .then()
                    .statusCode(201);
    }

    @Test
    public void createTestAndQuestionsAndPublishAT() {

        String tokenResponse = LoginUser.loginUser(VALID_EMAIL, VALID_PASSWORD);

        Integer test_id = RestAssured
                .given()
                    .body(getAttributeCreateTestJson(true))
                    .headers("Authorization", "Bearer " + tokenResponse)
                .when()
                    .post("/tests")
                .then()
                    .statusCode(201).extract().response().path("test_id");

        for (int i = 0; i < 5; i++) {
            Integer question_id = RestAssured
                    .given()
                        .body(getAttributeQuestionJson())
                        .headers("Authorization", "Bearer " + tokenResponse)
                    .when()
                        .post("/tests/" + test_id + "/questions")
                    .then()
                        .statusCode(201).extract().response().path("question_id");

            for (int j = 0; j < 2; j++) {
                if (j == 1) {
                    RestAssured
                            .given()
                                .body(getAttributeAnswerJson(true))
                                .headers("Authorization", "Bearer " + tokenResponse)
                            .when()
                                .post("/questions/" + question_id + "/answers")
                            .then()
                                .statusCode(201);
                } else {
                    RestAssured
                            .given()
                                .body(getAttributeAnswerJson(false))
                                .headers("Authorization", "Bearer " + tokenResponse)
                            .when()
                                .post("/questions/" + question_id + "/answers")
                            .then()
                                .statusCode(201);
                }
            }
        }
        RestAssured
                .given()
                    .headers("Authorization", "Bearer " + tokenResponse)
                .when()
                    .patch("/tests/" + test_id + "/publish")
                .then()
                    .statusCode(200)
                    .body(containsString("Test published successfully"));
    }


    @Test
    public void viewResultsTestAT() {

        String tokenResponse = LoginUser.loginUser(VALID_EMAIL, VALID_PASSWORD);

        RestAssured
                .given()
                    .headers("Authorization", "Bearer " + tokenResponse)
                .when()
                    .get("/results/tests/1")
                .then()
                    .statusCode(200);
    }


    @Test
    public void viewTestAT() {

        String tokenResponse = LoginUser.loginUser(VALID_EMAIL, VALID_PASSWORD);

        RestAssured
                .given()
                    .headers("Authorization", "Bearer " + tokenResponse)
                .when()
                    .get("/tests/10/full")
                .then()
                    .statusCode(200)
                .body(containsString(TEST_10_INFO));
    }

}
