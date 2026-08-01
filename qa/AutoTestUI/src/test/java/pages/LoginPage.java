package pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.testng.Assert;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

import java.time.Duration;

public class LoginPage {

    WebDriver driver;

    public LoginPage(WebDriver driver) {
        this.driver = driver;
    }

    public void login (String email, String pass) {
        WebElement inputEmail = driver.findElement(By.xpath("//input[@placeholder='Email']"));
        WebElement inputPass = driver.findElement(By.xpath("//input[@placeholder='Password']"));
        WebElement button = driver.findElement(By.xpath("//button[text()='Login']"));

        inputEmail.sendKeys(email);
        inputPass.sendKeys(pass);
        button.click();
    }
}

