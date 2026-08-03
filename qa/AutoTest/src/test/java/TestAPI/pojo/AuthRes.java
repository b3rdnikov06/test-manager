package TestAPI.pojo;

public class AuthRes {
    private String token;

    public AuthRes() {}

    public AuthRes(String token) {
        this.token = token;
    }

    public String getToken() {
        return token;
    }
}
