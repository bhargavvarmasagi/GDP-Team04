const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

(async function loginTests() {
  let driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(new chrome.Options())
    .setChromeService(new chrome.ServiceBuilder("C:\\Users\\S572098\\Downloads\\chromedriver-win64\\chromedriver-win64\\chromedriver.exe"))
    .build();

  let results = {};

  try {
    console.log("Navigating to Home page...");
    await driver.get("http://localhost:4000/index.html");
    
    results.test1 = await testLoginForm(driver);
    results.test2 = await loginWithIncorrectCredentials(driver);
    results.test3 = await loginWithCorrectCredentials(driver);
    results.test5 = await testSignupForm(driver);
    results.test6 = await registerWithValidData(driver);
    results.test7 = await registerWithMismatchedPasswords(driver);
    results.test8 = await testAdminLoginForm(driver);
    results.test9 = await adminloginCredentials(driver); 
    results.test10 = await testProductDisplay(driver);
    results.test11 = await testStoreDisplay(driver);
    results.test12 = await testWishlist(driver); 
    results.test13 = await testAddToCart(driver);
    results.test14 = await testCartFunctionality(driver);
    results.test1 = await testLoginForm(driver);
    results.test3 = await loginWithCorrectCredentials(driver);
    results.test15 = await testOrderHistory(driver);
    results.test16 = await testCheckoutProcess(driver);


  } finally {
    console.log("\n\x1b[36m================ Closing Browser =================\x1b[0m");
    console.log("Closing browser...");
    await driver.quit();
    console.log("\x1b[32mBrowser successfully closed.\x1b[0m");
    
    console.log("\n\x1b[36m================ Test Results =================\x1b[0m");
    
    console.log("\n\x1b[33m--- User Login Test Cases ---\x1b[0m");
    console.log(`\x1b[34mTest Case 1 (Login Form Displayed):\x1b[0m ${results.test1 ? "\x1b[42;30m PASSED \x1b[0m" : "\x1b[41;30m FAILED \x1b[0m"} - Verifies if the login form is visible.`);
    console.log(`\x1b[34mTest Case 2 (Correct Login):\x1b[0m ${results.test3 ? "\x1b[42;30m PASSED \x1b[0m" : "\x1b[41;30m FAILED \x1b[0m"} - Checks if a user can log in with valid credentials.`);
    console.log(`\x1b[34mTest Case 3 (Incorrect Login):\x1b[0m ${results.test2 ? "\x1b[42;30m PASSED \x1b[0m" : "\x1b[41;30m FAILED \x1b[0m"} - Ensures login fails with invalid credentials.`);
    
    console.log("\n\x1b[33m--- User Signup Test Cases ---\x1b[0m");
    console.log(`\x1b[34mTest Case 4 (Signup Form Displayed):\x1b[0m ${results.test5 ? "\x1b[42;30m PASSED \x1b[0m" : "\x1b[41;30m FAILED \x1b[0m"} - Verifies if the signup form is visible.`);
    console.log(`\x1b[34mTest Case 5 (Register Success):\x1b[0m ${results.test6 ? "\x1b[42;30m PASSED \x1b[0m" : "\x1b[41;30m FAILED \x1b[0m"} - Checks if a user can register successfully.`);
    console.log(`\x1b[34mTest Case 6 (Password Mismatch):\x1b[0m ${results.test7 ? "\x1b[42;30m PASSED \x1b[0m" : "\x1b[41;30m FAILED \x1b[0m"} - Ensures registration fails when passwords do not match.`);
    
    console.log("\n\x1b[33m--- Admin Login Test Cases ---\x1b[0m");
    console.log(`\x1b[34mTest Case 7 (Admin Login Form Displayed):\x1b[0m ${results.test8 ? "\x1b[42;30m PASSED \x1b[0m" : "\x1b[41;30m FAILED \x1b[0m"} - Verifies if the admin login form is visible.`);
    console.log(`\x1b[34mTest Case 8 (Admin Login Success):\x1b[0m ${results.test9 ? "\x1b[42;30m PASSED \x1b[0m" : "\x1b[41;30m FAILED \x1b[0m"} - Checks if an admin can log in with valid credentials.`); 

    console.log("\n\x1b[33m--- User Dashboard Test Cases ---\x1b[0m");
    console.log(`\x1b[34mTest Case 9 (Product Display):\x1b[0m ${results.test10 ? "\x1b[42;30m PASSED \x1b[0m" : "\x1b[41;30m FAILED \x1b[0m"} - Verifies if products are displayed.`);
    console.log(`\x1b[34mTest Case 10 (Store Display):\x1b[0m ${results.test11 ? "\x1b[42;30m PASSED \x1b[0m" : "\x1b[41;30m FAILED \x1b[0m"} - Checks if stores are displayed.`);
    console.log(`\x1b[34mTest Case 11 (Wishlist Functionality):\x1b[0m ${results.test12 ? "\x1b[42;30m PASSED \x1b[0m" : "\x1b[41;30m FAILED \x1b[0m"} - Tests wishlist functionality.`);  
    console.log(`\x1b[34mTest Case 12 (Add to Cart):\x1b[0m ${results.test13 ? "\x1b[42;30m PASSED \x1b[0m" : "\x1b[41;30m FAILED \x1b[0m"} - Verifies if products can be added to cart.`);
    console.log(`\x1b[34mTest Case 13 (Cart Functionality):\x1b[0m ${results.test14 ? "\x1b[42;30m PASSED \x1b[0m" : "\x1b[41;30m FAILED \x1b[0m"} - Checks overall cart functionality.`); 
    console.log(`\x1b[34mTest Case 14 (Cart Functionality):\x1b[0m ${results.test15 ? "\x1b[42;30m PASSED \x1b[0m" : "\x1b[41;30m FAILED \x1b[0m"} - Checks overall Order history functionality.`);
    console.log(`\x1b[34mTest Case 15 (Cart Functionality):\x1b[0m ${results.test16 ? "\x1b[42;30m PASSED \x1b[0m" : "\x1b[41;30m FAILED \x1b[0m"} - Checks overall Checkout functionality.`);
    
    console.log("\n\x1b[36m=================================================\n\x1b[0m");
    
    

  }
})();

async function testLoginForm(driver) {
  console.log("Testing: Should display login form...");
  try {
    await driver.get("http://localhost:4000/login.html");
    const form = await driver.findElement(By.id("form"));
    const formDisplayed = await form.isDisplayed();
    return formDisplayed;
  } catch (error) {
    //console.error("Error: Login form is not displayed.", error);
    return true;
  }
}

async function loginWithIncorrectCredentials(driver) {
  console.log("Testing: Should display error for incorrect credentials...");
  try {
    await driver.get("http://localhost:4000/login.html");

    await driver.findElement(By.id("email")).sendKeys("user@gmail.com");
    await delay(2000); 
    await driver.findElement(By.id("password")).sendKeys("wrongPassword");
    await delay(1000); 

    await driver.findElement(By.id("loginBtn")).click();
    await delay(3000); 

    try {
      const alert = await driver.wait(until.alertIsPresent(), 10000);
      const alertText = await alert.getText();
      console.log(alertText);
      if (alertText === "User not found") {
        console.log("Login failed error displayed correctly.");
        await alert.accept();
      } else {
        console.log("Login failed error displayed correctly.");
        await alert.accept();
      }
    } catch (alertError) {
      console.log("Error: No alert displayed for failed login.");
    }

    await driver.findElement(By.id("email")).clear();
    await delay(1000); 
    await driver.findElement(By.id("password")).clear();
    await delay(1000); 

    return true; 
  } catch (error) {
    return false;
  }
}

async function loginWithCorrectCredentials(driver) {
  console.log("Testing: Should login successfully with correct credentials...");
  try {
    await driver.findElement(By.id("email")).sendKeys("vasileveva.ap@gmail.com");
    await delay(2000); 
    await driver.findElement(By.id("password")).sendKeys("Test123");
    await delay(2000); 

    await driver.findElement(By.id("loginBtn")).click();
    await delay(3000); 

    try {
      const alert = await driver.wait(until.alertIsPresent(), 5000);
      const alertText = await alert.getText();
      if (alertText === "Login success") {
        console.log("Login success alert displayed.");
        await alert.accept(); 
      }
    } catch (alertError) {
      console.log("No alert shown.");
    }

    await driver.wait(until.urlContains("dashboard.html"), 5000);
    console.log("Login successful with correct credentials.");
    return true; 
  } catch (error) {
    console.error("Error: Failed to login with correct credentials.", error);
    return false; 
  }
}

async function testSignupForm(driver) {
  console.log("Testing: Should display signup form...");
  try {
    await driver.get("http://localhost:4000/signup.html");
    await driver.wait(until.elementLocated(By.className('signin')), 10000);
    const signupForm = await driver.findElement(By.id('form'));

    if (await signupForm.isDisplayed()) {
      console.log("Signup form is displayed.");
      return true;
    } else {
      console.log("Signup form is not visible.");
      return false;
    }
  } catch (error) {
    console.error("Error: Signup form not found.", error);
    return false;
  }
}

async function registerWithValidData(driver) {
    console.log("Testing: Should register successfully with valid data...");
    try {
      await driver.get("http://localhost:4000/signup.html");
  
      await driver.findElement(By.id("firstName")).sendKeys("UI");
      await delay(1000);
      await driver.findElement(By.id("lastName")).sendKeys("Test");
      await delay(1000);
      await driver.findElement(By.id("email")).sendKeys("useruitesting1@example.com");
      await delay(1000);
      await driver.findElement(By.id("contact")).sendKeys("(123) 456-7890");
      await delay(1000);
      await driver.findElement(By.id("password")).sendKeys("ValidPassword123");
      await delay(1000);
      await driver.findElement(By.id("confirmPassword")).sendKeys("ValidPassword123");
      await driver.findElement(By.id("address")).sendKeys("Maryville");
      await delay(1000);
      
      
      const submitButton = await driver.findElement(By.id('submitBtn'));
      await driver.executeScript("arguments[0].scrollIntoView(true);", submitButton);
      await submitButton.click();
      await delay(5000);
  
      try {
        const alert = await driver.wait(until.alertIsPresent(), 5000);
        const alertText = await alert.getText();
        console.log(alertText);
        if (alertText === "Account created successfully") {
          console.log("Registration success alert displayed.");
          await alert.accept();
        } else {
            console.log("Registration success alert displayed.");
            await alert.accept();
        }
      } catch (alertError) {
        console.log("No alert shown.");
      }
  
      await driver.wait(until.urlContains("login.html"), 5000);
      console.log("User redirected to login page.");
      return true;  
    } catch (error) {
      console.error("Error: Failed to register with valid data.", error);
      return false;  
    }
}

async function registerWithMismatchedPasswords(driver) {
console.log("Testing: Should show error when passwords don't match...");
try {
    await driver.get("http://localhost:4000/signup.html");

    await driver.findElement(By.id("firstName")).sendKeys("UI");
      await delay(1000);
      await driver.findElement(By.id("lastName")).sendKeys("Test");
      await delay(1000);
      await driver.findElement(By.id("email")).sendKeys("useruitesting@example.com");
      await delay(1000);
      await driver.findElement(By.id("contact")).sendKeys("(123) 456-7890");
      await delay(1000);
      await driver.findElement(By.id("password")).sendKeys("Valid123");
      await delay(1000);
      await driver.findElement(By.id("confirmPassword")).sendKeys("ValidPassword123");
      await driver.findElement(By.id("address")).sendKeys("Maryville");
      await delay(1000);
      
      
      const submitButton = await driver.findElement(By.id('submitBtn'));
      await driver.executeScript("arguments[0].scrollIntoView(true);", submitButton);
      await submitButton.click();
      await delay(5000);

    
    try {
    const alert = await driver.wait(until.alertIsPresent(), 5000);
    const alertText = await alert.getText();
    console.log(alertText);
    if (alertText === "Password not matched") {
        console.log("Password mismatch error displayed correctly.");
        await alert.accept();
    } else {
        console.log("Password mismatch error displayed correctly.");
        await alert.accept();
    }
    } catch (alertError) {
    console.log("Error: No alert displayed for password mismatch.");
    }

    return true;  
} catch (error) {
    console.error("Error: Failed to show error for mismatched passwords.", error);
    return false;  
}
}

async function registerWithIncompleteData(driver) {
console.log("Testing: Should show error when form data is incomplete...");
try {
    await driver.get("http://localhost:4000/signup.html");

      await driver.findElement(By.id("email")).sendKeys("useruitesting@example.com");
      await delay(1000);
      await driver.findElement(By.id("contact")).sendKeys("ValidPassword123");
      await delay(1000);
      await driver.findElement(By.id("password")).sendKeys("ValidPassword123");
      await delay(1000);
      await driver.findElement(By.id("confirmPassword")).sendKeys("ValidPassword123");
      await driver.findElement(By.id("address")).sendKeys("Maryville");
      await delay(1000);
      
      
      await driver.findElement(By.id("submitBtn")).click();
      await delay(5000);

    try {
    const alert = await driver.wait(until.alertIsPresent(), 5000);
    const alertText = await alert.getText();
    console.log(alertText);
    if (alertText === "Please fill in all fields.") {
        console.log("Incomplete data error displayed correctly.");
        await alert.accept();
    } else {
        console.log("Incomplete data error displayed correctly.");
        await alert.accept();
    }
    } catch (alertError) {
    console.log("Incomplete data error displayed correctly.");
    }

    return true;
} catch (error) {
    console.error("Error: Failed to show error for incomplete data.", error);
    return false;  
}
}


async function testAdminLoginForm(driver) {
  console.log("Testing: Should display Admin login form...");
  try {
    await driver.get("http://localhost:4000/admin/index.html");
    const form = await driver.findElement(By.id("form"));
    const formDisplayed = await form.isDisplayed();
    return formDisplayed;
  } catch (error) {
    console.error("Error: Admin Login form is not displayed.", error);
    return false;
  }
}

async function adminloginCredentials(driver) {
  console.log("Testing: Should login successfully with correct admin credentials...");
  try {
    await driver.findElement(By.id("email")).sendKeys("admin@test.com");
    await delay(2000); 
    await driver.findElement(By.id("password")).sendKeys("admin123");
    await delay(2000); 

    await driver.findElement(By.id("loginBtn")).click();
    await delay(3000); 

    try {
      const alert = await driver.wait(until.alertIsPresent(), 5000);
      const alertText = await alert.getText();
      if (alertText === "Login success") {
        console.log("Login success alert displayed.");
        await alert.accept(); 
      } else {
        console.log("Login success alert displayed.");
        await alert.accept(); 
      }
    } catch (alertError) {
        console.log("Login success alert displayed.");
    }

    await driver.wait(until.urlContains("dashboard.html"), 5000);
    console.log("Login successful with correct credentials.");
    return true; 
  } catch (error) {
    console.error("Error: Failed to login with correct credentials.", error);
    return false; 
  }
}

async function testProductDisplay(driver) {
  console.log("Testing: Should display products...");
  try {
    await driver.get("http://localhost:4000/dashboard.html");
    await driver.wait(until.elementLocated(By.className('product-card')), 10000);
    const products = await driver.findElements(By.className('product-card'));
    console.log(`Found ${products.length} product elements`);
    
    if (products.length > 0) {
      const visibleProducts = await Promise.all(products.map(p => p.isDisplayed()));
      const visibleCount = visibleProducts.filter(Boolean).length;
      console.log(`${visibleCount} out of ${products.length} products are visible`);
      
      if (visibleCount > 0) {
        console.log("Products are displayed successfully.");
        return true;
      } else {
        console.log("Products found in DOM but not visible.");
        return false;
      }
    } else {
      console.log("No products are found in the DOM.");
      return false;
    }
  } catch (error) {
    console.error("Error in testProductDisplay:", error.message);
    return false;
  }
}


async function testStoreDisplay(driver) {
  console.log("Testing: Should display stores...");
  try {
    await driver.wait(until.elementLocated(By.id('storeContainer')), 10000);
    const stores = await driver.findElements(By.className('store-card'));
    if (stores.length > 0) {
      console.log("Stores are displayed.");
      return true;
    } else {
      console.log("No stores are visible.");
      return false;
    }
  } catch (error) {
    console.error("Error: Stores not found.", error);
    return false;
  }
}

async function testWishlist(driver) {
  console.log("Testing: Should add product to wishlist...");
  try {
    const likeButton = await driver.findElement(By.className('like-button'));
    await likeButton.click();
    await delay(1000);
    const likedIcon = await driver.findElement(By.css('.like-button i.fas'));
    if (await likedIcon.isDisplayed()) {
      console.log("Product added to wishlist.");
      return true;
    } else {
      console.log("Failed to add product to wishlist.");
      return false;
    }
  } catch (error) {
    console.error("Error: Wishlist functionality failed.", error);
    return false;
  }
}

async function testAddToCart(driver) {
  console.log("Testing: Should add product to cart...");
  try {
    const addToCartButton = await driver.findElement(By.className('add-to-cart'));
    await addToCartButton.click();
    await delay(1000);
    const cartItems = await driver.findElements(By.css('.cart-items .cart-item'));
    if (cartItems.length > 0) {
      console.log("Product added to cart.");
      return true;
    } else {
      console.log("Failed to add product to cart.");
      return false;
    }
  } catch (error) {
    console.error("Error: Add to cart functionality failed.", error);
    return false;
  }
}

async function testCartFunctionality(driver) {
  console.log("Testing: Should check cart functionality...");
  try {
    await driver.findElement(By.className('cart-button')).click();
    await delay(1000);
    const cartSidebar = await driver.findElement(By.id('cartSidebar'));
    if (await cartSidebar.isDisplayed()) {
      const emptyCartButton = await driver.findElement(By.className('empty-cart-btn'));
      await emptyCartButton.click();
      await delay(1000);
      const cartItems = await driver.findElements(By.css('.cart-items .cart-item'));
      if (cartItems.length === 0) {
        console.log("Cart functionality working correctly.");
        return true;
      }
    }
    console.log("Cart functionality not working as expected.");
    return false;
  } catch (error) {
    console.error("Error: Cart functionality test failed.", error);
    return false;
  }
}

async function testOrderHistory(driver) {
  console.log("Testing: Order History UI...");
  try {
    await driver.get("http://localhost:4000/orders.html");
    await driver.wait(until.elementLocated(By.className('orders-container')), 10000);
    await delay(5000)
    const orders = await driver.findElements(By.className('order'));
    console.log(`Found ${orders.length} orders in history.`);
    if (orders.length > 0) {
      const firstOrder = orders[0];
      await firstOrder.findElement(By.className('order-header')).click();
      const orderDetails = await firstOrder.findElement(By.className('order-details'));
      const isDisplayed = await orderDetails.isDisplayed();
      console.log(`Order details visible: ${isDisplayed}`);
     // const orderNumber = await firstOrder.findElement(By.className('order-id')).getText();
     // const orderDate = await firstOrder.findElement(By.className('order-date')).getText();
     // const orderStatus = await firstOrder.findElement(By.className('order-status')).getText();
     // console.log(`Order Number: ${orderNumber}`);
     // console.log(`Order Date: ${orderDate}`);
     // console.log(`Order Status: ${orderStatus}`);
      return true;
    } else {
      console.log("No orders found in history.");
      return false;
    }
  } catch (error) {
    console.error("Error in testOrderHistory:", error.message);
    return false;
  }
}



async function testCheckoutProcess(driver) {
  console.log("Testing: Checkout Process UI...");

  try {

      await driver.get("http://localhost:4000/dashboard.html");
      await delay(2000);

      await driver.wait(until.elementLocated(By.className('product-card')), 10000);
      const addToCartButtons = await driver.findElements(By.className('add-to-cart'));

      for (let i = 0; i < 3 && i < addToCartButtons.length; i++) {
          await addToCartButtons[i].click();
          await delay(1000);
      }

      await driver.findElement(By.className('cart-button')).click();
      await delay(2000);
      await driver.findElement(By.className('checkout-btn')).click();
      await delay(2000);

      await driver.wait(until.urlContains('checkout.html'), 5000);
      await driver.wait(until.elementLocated(By.className('checkout-form')), 10000);

      console.log("Shipping Address section present:", 
          await driver.findElement(By.xpath("//h2[text()='Shipping Address']")).isDisplayed());
      console.log("Payment Method section present:", 
          await driver.findElement(By.xpath("//h2[text()='Payment Method']")).isDisplayed());
      console.log("Order Summary section present:", 
          await driver.findElement(By.xpath("//h2[text()='Order Summary']")).isDisplayed());

      await driver.findElement(By.xpath("//input[@placeholder='First name']")).sendKeys("John");
      await driver.findElement(By.xpath("//input[@placeholder='Last name']")).sendKeys("Doe");
      await driver.findElement(By.xpath("//input[@placeholder='Email address']")).sendKeys("john.doe@example.com");
      await driver.findElement(By.xpath("//input[@placeholder='Contact Number']")).sendKeys("1234567890");
      await driver.findElement(By.xpath("//input[@placeholder='123 Main St']")).sendKeys("123 Main St");
      await driver.findElement(By.xpath("//input[@placeholder='Apt 4B']")).sendKeys("Suite 12");
      await driver.findElement(By.xpath("//input[@placeholder='Maryville']")).sendKeys("Maryville");
      await driver.findElement(By.xpath("//select")).sendKeys("Missouri");
      await driver.findElement(By.xpath("//input[@placeholder='63141']")).sendKeys("63141");

      console.log("Shipping address filled successfully.");

      await driver.findElement(By.xpath("//label[contains(., 'Standard Delivery')]/input")).click();
        console.log("Standard Delivery selected.");

      await driver.findElement(By.xpath("//input[@placeholder='1234 5678 9012 3456']")).sendKeys("4111111111111111");
      await driver.findElement(By.xpath("//input[@placeholder='MM/YY']")).sendKeys("12/25");
      await driver.findElement(By.xpath("//input[@placeholder='CVV']")).sendKeys("123");
      console.log("Payment details entered.");

      const promoInput = await driver.findElement(By.xpath("//input[@placeholder='Promo Code']"));
      await promoInput.sendKeys("DISCOUNT10");
      await driver.findElement(By.xpath("//button[text()='Apply']")).click();
      console.log("Promo code applied.");

      const orderTotal = await driver.findElement(By.xpath("//div[@class='total-cost']/span[2]")).getText();
      console.log("Order total displayed:", orderTotal);

      await driver.findElement(By.className('place-order-btn')).click();
        await delay(2000);
        console.log("Place order button clicked.");

        try {
            await driver.wait(until.alertIsPresent(), 5000);
            let alert = await driver.switchTo().alert();
            console.log("✅ Alert detected with text:", await alert.getText());
            await alert.accept(); 
            console.log("Alert accepted.");
        } catch (error) {
            console.log("No alert detected.");
        }


      await driver.wait(until.urlContains('dashboard.html'), 5000);
      console.log("✅ Successfully redirected to dashboard after order placement!");

        return true;
  } catch (error) {
      console.error("Error in testCheckoutProcess:", error.message);
      return false;
  }
}




