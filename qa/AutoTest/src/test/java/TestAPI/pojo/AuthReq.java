package TestAPI.pojo;

public class AuthReq {
    private String email;
    private String password;

    public AuthReq(String email, String password) {
        this.email = email;
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }
}
