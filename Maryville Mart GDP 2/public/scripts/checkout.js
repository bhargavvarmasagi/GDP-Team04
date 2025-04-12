
var cart = JSON.parse(localStorage.getItem("cart")) || [];
var products = [];

document.addEventListener('DOMContentLoaded', async function () {
   // await getProducts();
    displayCartItems();
    setupDeliveryOptions();
    setupPlaceOrder();
    updateCartDisplay();
});


function toggleCart() {
    document.getElementById("cartSidebar").classList.toggle("open");
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.ProductID !== productId);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartDisplay();
    displayCartItems();
}

function updateCartDisplay() {
    const cartItemsContainer = document.querySelector(".cart-items");
    const cartTotalElement = document.querySelector(".cart-total");
    const cartTaxElement = document.querySelector(".cart-tax");
    cartItemsContainer.innerHTML = "";
    let totalPrice = 0;
    console.log(cart)
    if (cart.length > 0) {
        cart.forEach(item => {
            const price = parseFloat(item.Price);
            totalPrice += price * parseFloat(item.quantity);
            const itemElement = document.createElement("div");
            itemElement.classList.add("cart-item");
            itemElement.innerHTML = `
                <img src="${item.ImgUrl}" alt="${item.ProductName}">
                <span>${item.ProductName}</span>
                <span>$${price.toFixed(2)} x ${item.quantity}</span>
                <button onclick="removeFromCart(${item.ProductID})"><i class="fas fa-times"></i></button>
            `;
            cartItemsContainer.appendChild(itemElement);
        });
    } else {
        cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
    }
    let tax = totalPrice * 0.1;
    cartTaxElement.textContent = `Tax (10%): $${tax.toFixed(2)}`;
    cartTotalElement.textContent = `Total: $${(totalPrice + tax).toFixed(2)}`;
}

function emptyCart() {
    cart = [];
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartDisplay();
    displayCartItems();
}

async function getProducts() {
    try {
        const response = await fetch(`/api/public/getProducts`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        const productData = await response.json();

        console.log(productData.products);
        products = productData.products;

        if (Array.isArray(products) && products.length > 0) {
            renderProducts(products);

            categoryDropdown.innerHTML = `<option value="">All Categories</option>`;
            [...new Set(products.map(product => product.Category))].forEach(category => {
                categoryDropdown.innerHTML += `<option value="${category}">${category}</option>`;
            });
        } else {
            productContainer.innerHTML = "<p>No products available.</p>";
        }
    } catch (error) {
        console.error('Error fetching products:', error);
        productContainer.innerHTML = "<p>Failed to load products. Please try again later.</p>";
    }
}

function setupDeliveryOptions() {
    const deliveryOptions = document.querySelectorAll("input[name='delivery']");
    deliveryOptions.forEach(option => {
        option.addEventListener("change", updateOrderSummary);
    });
}


function updateOrderSummary() {
    const orderSummary = document.querySelector(".order-summary .summary-card");
    const selectedDelivery = document.querySelector("input[name='delivery']:checked");
    let deliveryCost = 0;

    if (selectedDelivery.nextElementSibling.querySelector(".option-title").textContent === "Express Delivery") {
        deliveryCost = 12.99;
    }

    let subtotal = cart.reduce((sum, item) => sum + item.Price * item.quantity, 0);
    const taxRate = 0.10;
    const tax = subtotal * taxRate;
    const total = subtotal + tax + deliveryCost;

    const costBreakdown = orderSummary.querySelector(".cost-breakdown");
    costBreakdown.innerHTML = `
        <div class="cost-item">
            <span>Subtotal</span>
            <span>$${subtotal.toFixed(2)}</span>
        </div>
        <div class="cost-item">
            <span>Shipping</span>
            <span class="${deliveryCost === 0 ? "free-shipping" : ""}">$${deliveryCost.toFixed(2)}</span>
        </div>
        <div class="cost-item">
            <span>Tax</span>
            <span>$${tax.toFixed(2)}</span>
        </div>
    `;

    const totalCost = orderSummary.querySelector(".total-cost");
    totalCost.innerHTML = `
        <span>Total</span>
        <span>$${total.toFixed(2)}</span>
    `;
}


function displayCartItems() {
    const orderSummary = document.querySelector(".order-summary .summary-card");
    const existingProductItems = orderSummary.querySelectorAll(".product-item");
    existingProductItems.forEach(item => item.remove());

    cart.forEach(item => {
        const productItem = document.createElement("div");
        productItem.classList.add("product-item");
        productItem.innerHTML = `
            <img src="${item.ImgUrl}" alt="${item.ProductName}">
            <div class="product-details">
                <p>${item.ProductName}</p>
                <p>Quantity: ${item.quantity}</p>
                <p class="price">$${(item.Price * item.quantity).toFixed(2)}</p>
            </div>
        `;
        orderSummary.insertBefore(productItem, orderSummary.querySelector(".promo-code"));
    });

    updateOrderSummary();
}


function setupPlaceOrder() {
    
    const placeOrderBtn = document.querySelector(".place-order-btn");
    placeOrderBtn.addEventListener("click", async function () {
        if(!cart[0]){
            alert("Cart is empty!");
            return
        }
        const selectedDelivery = document.querySelector("input[name='delivery']:checked");
        if (!selectedDelivery) {
            alert("Please select a delivery method.");
            return;
        }
        const deliveryMethod = selectedDelivery.nextElementSibling.querySelector(".option-title").textContent;

        const addressForm = document.querySelector(".address-form");
        const shippingDetails = {
            firstName: addressForm.querySelector("input[placeholder='First name']").value.trim(),
            lastName: addressForm.querySelector("input[placeholder='Last name']").value.trim(),
            email: addressForm.querySelector("input[placeholder='Email address']").value.trim(),
            phone: addressForm.querySelector("input[placeholder='Contact Number']").value.trim(),
            street: addressForm.querySelector("input[placeholder='123 Main St']").value.trim(),
            apartment: addressForm.querySelector("input[placeholder='Apt 4B']").value.trim(),
            city: addressForm.querySelector("input[placeholder='Maryville']").value.trim(),
            state: addressForm.querySelector("select").value,
            zip: addressForm.querySelector("input[placeholder='63141']").value.trim(),
        };

        if (!shippingDetails.firstName || !shippingDetails.lastName || !shippingDetails.street || !shippingDetails.city || !shippingDetails.state || !shippingDetails.zip) {
            alert("Please fill in all required shipping details.");
            return;
        }

       // const selectedPayment = document.querySelector("input[name='payment']:checked");
        
       // const paymentMethod = selectedPayment.nextElementSibling.textContent.trim();

        const totalAmount = parseFloat(document.querySelector(".total-cost span:last-child").textContent.replace("$", ""));
        if (isNaN(totalAmount) || totalAmount <= 0) {
            alert("Invalid total amount.");
            return;
        }

        const customerID = localStorage.getItem("customerId");
 
        if (!customerID) {
            alert("User not logged in. Please log in to place an order.");
            return;
        }

        const orderData = {
            customerID: customerID,
            totalAmount: totalAmount,
            products: cart,
            shipping: shippingDetails,
            deliveryMethod: deliveryMethod,
            paymentMethod: "Credit Card",
        };
        console.log(!orderData.products[0], orderData.products)
        if(!orderData.products[0]){
            alert("Cart is empty!");
            return
        }
        try {
            const response = await fetch('/api/public/order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderData)
            });

            const result = await response.json();
            if (response.ok) {
                localStorage.removeItem("cart");
                alert("Ordered Placed ✅");
                window.location.href = "dashboard.html";
            } else {
                alert("Order failed: " + result.message);
            }
        } catch (error) {
            console.error("Error placing order:", error);
            alert("Something went wrong. Please try again.");
        }
    });
}


displayCartItems();
