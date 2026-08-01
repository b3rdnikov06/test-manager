package pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

public class RegisterPageStudent {

    WebDriver driver;

    public RegisterPageStudent(WebDriver driver) {
        this.driver = driver;
    }

    public void register(String first, String last, String email, String pass) {
        WebElement inputFirstName = driver.findElement(By.xpath("//input[1]"));
        WebElement inputLastName = driver.findElement(By.xpath("//input[2]"));
        WebElement inputEmail = driver.findElement(By.xpath("//input[3]"));
        WebElement inputPass = driver.findElement(By.xpath("//input[4]"));
        WebElement button = driver.findElement(By.xpath("//button[@class='btn-primary auth-btn']"));

        inputFirstName.sendKeys(first);
        inputLastName.sendKeys(last);
        inputEmail.sendKeys(email);
        inputPass.sendKeys(pass);
        button.click();
    }
}
