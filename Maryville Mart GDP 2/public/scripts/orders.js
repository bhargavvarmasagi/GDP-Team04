var CustomerID, ProductID;

document.addEventListener("DOMContentLoaded", async function () {
    const ordersContainer = document.querySelector(".orders-container");
    document.getElementById("reviewModal").style.display = "none";
    try {
        const response = await fetch("/api/public/orders");
        const orders = await response.json();

        if (orders.length === 0) {
            ordersContainer.innerHTML = "<p>No orders found.</p>";
            return;
        }

        orders.forEach(order => {
            const orderElement = document.createElement("div");
            orderElement.classList.add("order");

            orderElement.innerHTML = `
                <div class="order-header" onclick="toggleOrderDetails(this)">
                    <h3>Order #${order.OrderID} - ${new Date(order.OrderDate).toLocaleDateString()}</h3>
                    <span class="status ${order.OrderStatus.toLowerCase()}">${order.OrderStatus}</span>
                    ${order.OrderStatus === 'Store Pickup' ? `<button onclick="trackOrder(${order.OrderID}, '${order.StreetAddress}', '${order.City}', '${order.State}', '${order.ZipCode}')">Track Order</button>` : ''}

                </div>
                <div class="order-details">
                    <p><strong>Total Amount:</strong> $${order.TotalAmount}</p>
                    <p><strong>Delivery Method:</strong> ${order.DeliveryMethod}</p>
                    <p><strong>Delivery Partner:</strong> ${order.DeliveryPartnerEmail ? order.DeliveryPartnerEmail : "Not assigned"}</p>
                    <p><strong>Delivery Update:</strong> ${order.DeliveryUpdate ? order.DeliveryUpdate : "No updates"}</p>
                    <p><strong>Payment Method:</strong> ${order.PaymentMethod}</p>
                    <p><strong>Shipping Address:</strong> ${order.StreetAddress}, ${order.City}, ${order.State} ${order.ZipCode}</p>

                    <table class="order-table">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Quantity</th>
                                <th>Price</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${order.Products.map(product => `
                                <tr>
                                    <td>${product.ProductName}</td>
                                    <td>${product.quantity}</td>
                                    <td>$${Number(product.Price).toFixed(2)}</td>
                                    <td><button class="review-btn" onclick="openReviewModal('${product.ProductName}', '${product.ProductID}', '${order.CustomerID}')">Rate & Review</button></td>
                                </tr>
                            `).join("")}
                        </tbody>
                    </table>
                </div>
            `;

            ordersContainer.appendChild(orderElement);
        });
    } catch (error) {
        console.error("Error fetching orders:", error);
        ordersContainer.innerHTML = "<p>Error loading orders.</p>";
    }

    
});

function trackOrder(orderId, street, city, state, zip) {
    const modal = document.getElementById("trackMapModal");
    modal.style.display = "block";

    const storeLocation = [35.7565, -83.9705]; // Maryville center point
    const address = `${street}, ${city}, ${state}`;
    console.log(address)
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`)
        .then(response => response.json())
        .then(data => {
            if (data && data.length > 0) {
                const userLat = parseFloat(data[0].lat);
                const userLng = parseFloat(data[0].lon);
                simulateDelivery(storeLocation, [userLat, userLng]);
            } else {
                alert("Failed to locate user's address.");
            }
        });
}

function simulateDelivery(from, to) {
    const map = L.map('trackMap').setView(from, 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
    }).addTo(map);

    const marker = L.marker(from, { icon: L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/1995/1995471.png',
        iconSize: [30, 30]
    })}).addTo(map);

    L.marker(to).addTo(map).bindPopup("User Location").openPopup();

    // Draw polyline path
    const route = L.polyline([from, to], { color: 'blue', weight: 4, opacity: 0.7 }).addTo(map);
    map.fitBounds(route.getBounds(), { padding: [50, 50] });

    let startTime = Date.now();
    const duration = 60000; // 1 minute
    const interval = 1000;

    const intervalId = setInterval(() => {
        const elapsed = Date.now() - startTime;
        if (elapsed >= duration) {
            clearInterval(intervalId);
            marker.setLatLng(to);
            return;
        }

        const progress = elapsed / duration;
        const lat = from[0] + (to[0] - from[0]) * progress;
        const lng = from[1] + (to[1] - from[1]) * progress;
        marker.setLatLng([lat, lng]);
    }, interval);
}


function toggleOrderDetails(headerElement) {
    const details = headerElement.nextElementSibling;
    details.style.display = details.style.display === "block" ? "none" : "block";
}

function openReviewModal (productName, productID, customerID) {
    document.getElementById("productTitle").textContent = `Review for ${productName}`;
    document.getElementById("reviewText").value = "";
    selectedRating = 0; 
    updateStarDisplay(); 
    document.getElementById("reviewModal").style.display = "flex";
    ProductID = productID;
    CustomerID = customerID;
};


document.querySelector(".close").addEventListener("click", function () {
    document.getElementById("reviewModal").style.display = "none";
});


document.querySelectorAll(".star").forEach(star => {
    star.addEventListener("click", function () {
        selectedRating = this.getAttribute("data-value"); 
        updateStarDisplay();
    });

    
    star.addEventListener("mouseover", function () {
        highlightStars(this.getAttribute("data-value"));
    });

    star.addEventListener("mouseout", function () {
        updateStarDisplay();
    });
});


document.getElementById("submitReview").addEventListener("click", async function () {
    const reviewText = document.getElementById("reviewText").value;
    const rating = parseFloat(selectedRating);
    
    if (!rating || rating < 1 || rating > 5) {
        alert("Please select a rating between 1 and 5 stars.");
        return;
    }

    try {
        const response = await fetch('/api/public/addReview', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ProductID: ProductID,
                CustomerID: CustomerID,
                Rating: rating,
                ReviewText: reviewText
            }),
        });

        const data = await response.json();

        if (response.ok) {
            alert('Review submitted successfully!');
            document.getElementById("reviewModal").style.display = "none";
        } else {
            console.error('Review submission failed:', data.message);
            alert(data.message || 'Failed to submit review. Please try again.');
        }
    } catch (error) {
        console.error('Error submitting review:', error);
        alert('An error occurred. Please try again.');
    }
});



function updateStarDisplay() {
    document.querySelectorAll(".star").forEach(star => {
        const value = star.getAttribute("data-value");
        star.classList.toggle("active", value <= selectedRating);
    });
}


function highlightStars(value) {
    document.querySelectorAll(".star").forEach(star => {
        star.classList.toggle("active", star.getAttribute("data-value") <= value);
    });
}



