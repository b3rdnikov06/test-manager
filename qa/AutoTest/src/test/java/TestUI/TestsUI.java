package TestUI;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;
import TestUI.pages.LoginPage;
import TestUI.pages.RegisterPageStudent;
import TestUI.pages.RegisterPageTeacher;

import java.time.Duration;
import java.util.List;

public class TestsUI {

    WebDriver driver;
    WebDriverWait wait;

    private final String BASE_URL = "http://localhost:5173";

    @BeforeMethod
    public void setUp() {
        driver = new ChromeDriver();
        wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(5));
    }

    @Test
    public void successfulLoginStudent() {

        driver.get(BASE_URL + "/login");

        LoginPage lp = new LoginPage(driver);
        lp.login("berdnikovpetr2019@gmail.com", "123456123456");

        WebElement userName = wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.xpath("//div[@class='navbar-user-text']")));
        Assert.assertEquals(userName.getText(), "Petr Berdnikov\nStudent");
    }

    @Test
    public void errorPassword() {

        driver.get(BASE_URL + "/login");

        LoginPage lp = new LoginPage(driver);
        lp.login("berdnikovpetr2019@gmail.com", "123456");

        WebElement userName = wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.xpath("//div[@class='error-message']")));
        Assert.assertEquals(userName.getText(), "Wrong password");
    }

    @Test
    public void errorLogin() throws InterruptedException {

        driver.get(BASE_URL + "/login");

        LoginPage lp = new LoginPage(driver);
        lp.login("berdnikovpetr2019@gmail", "123456");

        Thread.sleep(200);

        WebElement userName = driver.findElement(By.xpath("//div[@class='error-message']"));
        Assert.assertEquals(userName.getText(), "User not found");
    }

    @Test
    public void successfulRegisterStudentAndLogin() throws InterruptedException {

        driver.get(BASE_URL + "/register");
        long timestamp = System.currentTimeMillis();

        RegisterPageStudent rps = new RegisterPageStudent(driver);
        rps.register("Test", "Test", "test" + timestamp + "@mail.ru", "12345678");

        Thread.sleep(200);

        LoginPage lp = new LoginPage(driver);
        lp.login("test" + timestamp + "@mail.ru", "12345678");

        WebElement userName = driver.findElement(By.xpath("//div[@class='navbar-user-text']"));
        Assert.assertEquals(userName.getText(), "Test Test\nStudent");
    }

    @Test
    public void successfulRegisterTeacherAndLogin() throws InterruptedException {

        driver.get(BASE_URL + "/register");
        long timestamp = System.currentTimeMillis();

        RegisterPageTeacher rpt = new RegisterPageTeacher(driver);
        rpt.register("Test", "Test", "test" + timestamp + "@mail.ru", "12345678");

        Thread.sleep(200);

        LoginPage lp = new LoginPage(driver);
        lp.login("test" + timestamp + "@mail.ru", "12345678");

        WebElement userName = driver.findElement(By.xpath("//div[@class='navbar-user-text']"));
        Assert.assertEquals(userName.getText(), "Test Test\nTeacher");
    }

    @Test
    public void successfulLoginTeacherAndCreateTest() throws InterruptedException {

        driver.get(BASE_URL + "/login");
        long timestamp = System.currentTimeMillis();

        LoginPage lp = new LoginPage(driver);
        lp.login("testtest@mail.ru", "pas123pas123");

        Thread.sleep(200);

        driver.get(BASE_URL + "/tests/create");

        WebElement title = driver.findElement(By.xpath("//input[1]"));
        WebElement description = driver.findElement(By.xpath("//textarea"));
        WebElement buttonCreateTest = driver.findElement(By.xpath("//button[@class='btn-primary']"));

        title.sendKeys("AutoTest " + timestamp);
        description.sendKeys("AutoDescription " + timestamp);
        buttonCreateTest.click();

        driver.get(BASE_URL + "/tests/teacher");

        WebElement testName = driver.findElement(By.xpath("//h2[@class='attempt-title']"));
        Assert.assertTrue(testName.getText().contains("AutoTest " + timestamp));
    }

    @Test
    public void successfulLoginTeacherAndCreateTestWithQuestions() throws InterruptedException {

        driver.get(BASE_URL + "/login");
        long timestamp = System.currentTimeMillis();

        LoginPage lp = new LoginPage(driver);
        lp.login("testtest@mail.ru", "pas123pas123");

        Thread.sleep(200);

        driver.get(BASE_URL + "/tests/create");

        WebElement title = driver.findElement(By.xpath("//input[1]"));
        WebElement description = driver.findElement(By.xpath("//textarea"));
        WebElement buttonCreateTest = driver.findElement(By.xpath("//button[@class='btn-primary']"));

        title.sendKeys("AutoTest " + timestamp);
        description.sendKeys("AutoDescription " + timestamp);
        buttonCreateTest.click();

        WebElement question = driver.findElement(By.xpath("//input[@placeholder='Question text']"));
        WebElement buttonAddQuestion = driver.findElement(By.xpath("//button[@type='submit']"));
        WebElement selectElement = driver.findElement(By.xpath("//select"));
        Select select = new Select(selectElement);

        for (int i = 1; i <= 5; i++) {
            question.sendKeys("Question number " + i);
            select.selectByIndex((i - 1) % 3);
            buttonAddQuestion.click();
        }

        Thread.sleep(500);

        List<WebElement> questionCards =
                driver.findElements(By.className("editor-question-card"));

        for (int i = 0; i < 5; i++) {
            WebElement card = questionCards.get(i);
            if (i == 2) {
                WebElement inputAnswerText =
                        card.findElement(By.xpath(".//input[@placeholder='Answer text']"));
                inputAnswerText.sendKeys("Answer type 'text'");

                WebElement buttonAddAnswer =
                        card.findElement(By.xpath(".//button[contains(text(),'Add Answer')]"));
                buttonAddAnswer.click();
            } else {
                for (int j = 1; j <= 2; j++) {
                    WebElement inputAnswerText =
                            card.findElement(By.xpath(".//input[@placeholder='Answer text']"));
                    inputAnswerText.sendKeys("Answer number " + j);
                    if (j == 2) {
                        WebElement inputCorrectAnswer =
                                card.findElement(By.xpath(".//label/input"));
                        inputCorrectAnswer.click();
                    }
                    WebElement buttonAddAnswer =
                            card.findElement(By.xpath(".//button[contains(text(),'Add Answer')]"));
                    buttonAddAnswer.click();
                }
            }
        }
        WebElement buttonPublishTest = driver.findElement(By.xpath("//button[text()='Publish Test']"));
        buttonPublishTest.click();

        driver.get(BASE_URL + "/tests/teacher");

        WebElement headerTest = driver.findElement(By.xpath("(//div[@class='question-header'])[1]"));
        Assert.assertTrue(headerTest.getText().contains("AutoTest " + timestamp));
        Assert.assertTrue(headerTest.getText().contains("Published"));

    }

    @AfterMethod
    public void tearDown() {
        driver.quit();
    }
}