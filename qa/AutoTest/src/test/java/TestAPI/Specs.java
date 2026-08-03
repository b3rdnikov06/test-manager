package TestAPI;

import io.restassured.RestAssured;
import io.restassured.builder.RequestSpecBuilder;
import io.restassured.http.ContentType;
import io.restassured.specification.RequestSpecification;
import io.restassured.specification.ResponseSpecification;
import org.openqa.selenium.devtools.latest.network.model.Request;

public class Specs {

    public static RequestSpecification requestSpec(String baseUri, int port) {
        return new RequestSpecBuilder()
                .setBaseUri(baseUri)
                .setPort(port)
                .setContentType(ContentType.JSON)
                .build();
    }

    public static void installSpec(RequestSpecification request) {
        RestAssured.requestSpecification = request;
    }
}
