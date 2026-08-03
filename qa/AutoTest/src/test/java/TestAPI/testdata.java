package TestAPI;

// info block
//
// *AT = AuthorizedTeacher
//
// info block

public class testdata {

    public static final String URL = "http://localhost";
    public static final Integer PORT = 3000;


    public static final String VALID_EMAIL = "testtest@mail.ru";
    public static final String VALID_PASSWORD = "pas123pas123";

    public static final String UNRECORDER_EMAIL = "wrong@mail.ru";
    public static final String INCORRECT_PASSWORD = "wrongpassword";

    public static final String TEST_10_INFO = "{\"id\":10,\"title\":\"Первый\",\"description\":\"Первый\",\"time_limit\":5,\"is_published\":1,\"questions\":[{\"id\":16,\"text\":\"Сколько ног\",\"type\":\"single\",\"answers\":[{\"id\":31,\"text\":\"Две\",\"is_correct\":1},{\"id\":32,\"text\":\"Одна\",\"is_correct\":0}]},{\"id\":17,\"text\":\"Сколько рук\",\"type\":\"single\",\"answers\":[{\"id\":33,\"text\":\"Две\",\"is_correct\":1},{\"id\":34,\"text\":\"Одна\",\"is_correct\":0}]},{\"id\":18,\"text\":\"Сколько глаз\",\"type\":\"single\",\"answers\":[{\"id\":35,\"text\":\"Два\",\"is_correct\":1},{\"id\":36,\"text\":\"Один\",\"is_correct\":0}]},{\"id\":19,\"text\":\"Сколько ушей\",\"type\":\"single\",\"answers\":[{\"id\":37,\"text\":\"Два\",\"is_correct\":1},{\"id\":38,\"text\":\"Одно\",\"is_correct\":0}]},{\"id\":20,\"text\":\"Сколько языков\",\"type\":\"single\",\"answers\":[{\"id\":39,\"text\":\"Два\",\"is_correct\":0},{\"id\":40,\"text\":\"Один\",\"is_correct\":1}]}]}";

    public static String getUniqueEmail() {
        return "test" + System.currentTimeMillis() + "@mail.ru";
    }

    public static String getIncorrectUniqueEmail() {
        return "incorrect" + System.currentTimeMillis() + "mail.ru";
    }

    public static String getRegisterJson(String role) {
        return "{\n" +
                "    \"first_name\": \"Test\",\n" +
                "    \"last_name\": \"Test\",\n" +
                "    \"email\": \"" + getUniqueEmail() + "\",\n" +
                "    \"password\": \"12345678\",\n" +
                "    \"role\": \"" + role + "\"\n" +
                "}";
    }

    public static String getIncorrectRegisterJson(String role) {
        return "{\n" +
                "    \"first_name\": \"Test\",\n" +
                "    \"last_name\": \"Test\",\n" +
                "    \"email\": \"" + getIncorrectUniqueEmail() + "\",\n" +
                "    \"password\": \"12345678\",\n" +
                "    \"role\": \"" + role + "\"\n" +
                "}";
    }

    public static String getAttributeCreateTestJson(boolean x) {
        if (x == true) {
            return "{\n" +
                    "    \"title\": \"" + System.currentTimeMillis() + "\",\n" +
                    "    \"description\": \"" + System.currentTimeMillis() + "\",\n" +
                    "    \"time_limit\": 5\n" +
                    "}";
        } else {
            return "{\n" +
                    "    \"title\": \"\",\n" +
                    "    \"description\": \"" + System.currentTimeMillis() + "\",\n" +
                    "    \"time_limit\": 5\n" +
                    "}";
        }
    }

    public static String getAttributeQuestionJson() {
        return "{\n" +
                "    \"text\": \"" + "Questions " + System.currentTimeMillis() + "\",\n" +
                "    \"type\": \"single\"\n" +
                "}";
    }

    public static String getAttributeAnswerJson(boolean x) {
        if (x == true) {
            return "{\n" +
                    "    \"text\": \"" + "Answer " + System.currentTimeMillis() + "\",\n" +
                    "    \"is_correct\": true\n" +
                    "}";
        } else {
            return "{\n" +
                    "    \"text\": \"" + "Answer " + System.currentTimeMillis() + "\",\n" +
                    "    \"is_correct\": false\n" +
                    "}";
        }
    }
}
