package TestAPI.clientsAPI;

import TestAPI.pojo.AuthReq;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;

public class LoginUser {
    public static String loginUser(String email, String password) {

        AuthReq authReq = new AuthReq(email, password);

        return RestAssured
                .given()
                .when()
                    .contentType(ContentType.JSON)
                    .body(authReq)
                    .post("http://localhost:3000/auth/login")
                .then()
                    .extract()
                    .response()
                    .path("token");
    }
}
