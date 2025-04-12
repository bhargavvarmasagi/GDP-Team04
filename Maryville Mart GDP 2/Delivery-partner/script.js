var email
const urlParams = new URLSearchParams(window.location.search);
 if(urlParams.get("email")){
    email = urlParams.get("email")
} else {
    alert("Invalid Delivery Partner Login...")
    window.close();
}

document.addEventListener("DOMContentLoaded", async function () {


    const ordersTableBody = document.getElementById("ordersTableBody");

    try {
        const response = await fetch(`/api/public/delivery-partner/orders?email=${email}`);
        const orders = await response.json();
        console.log(orders)
        if (orders.length === 0) {
            ordersTableBody.innerHTML = "<tr><td colspan='10'>No orders found.</td></tr>";
            return;
        }

        orders.forEach(order => {
            const orderRow = document.createElement("tr");

            orderRow.innerHTML = `
                <td>${order.OrderID}</td>
                <td>${new Date(order.OrderDate).toLocaleString()}</td>
                <td>${order.CustomerName || "Guest"}</td>
                <td>$${Number(order.TotalAmount).toFixed(2)}</td>
                <td>${order.PaymentMethod}</td>
                <td class="status ${order.OrderStatus.toLowerCase()}">${order.OrderStatus}</td>
                <td>
                    <ul>
                    ${order.Products.map(product => {
                            return `<li>${product.ProductName} - ${product.quantity}</li>`;
                    }).join("")}
                    </ul>
                </td>
                <td><textarea class="delivery-update-text" data-order-id="${order.OrderID}" placeholder="Enter update">${order.DeliveryUpdate ? order.DeliveryUpdate : ""}</textarea></td>
                <td>
                    <select class="order-status-select" data-order-id="${order.OrderID}">
                        ${['Store Pickup', 'In Transit', 'Delivered'].map(statusOption => `
                            <option value="${statusOption}" ${order.OrderStatus === statusOption ? "selected" : ""}>${statusOption}</option>`).join("")}
                    </select>

                    <!-- Update Button -->
                    <button class="update-status-btn" data-order-id="${order.OrderID}" data-email="${order.Email}">Update</button>
                </td>`;
            
            ordersTableBody.appendChild(orderRow);
        });

        attachOrderUpdateListeners();
    } catch (error) {
        console.error("Error fetching orders:", error);
        ordersTableBody.innerHTML = "<tr><td colspan='10'>Error loading orders.</td></tr>";
    }
});

function attachOrderUpdateListeners() {
    document.querySelectorAll(".update-status-btn").forEach(button => {
        button.addEventListener("click", async function () {
            const orderId = this.getAttribute("data-order-id");
            
            
            const statusSelect = document.querySelector(`.order-status-select[data-order-id="${orderId}"]`);
            const deliveryUpdateText = document.querySelector(`.delivery-update-text[data-order-id="${orderId}"]`).value.trim();
            
            const newStatus = statusSelect.value;

            try {
                const response = await fetch(`/api/admin/orders/${orderId}/status`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        status: newStatus,
                        deliveryUpdate: deliveryUpdateText || null,
                        email: this.getAttribute("data-email")
                    })
                });

                if (response.ok) {
                    alert(`Order #${orderId} updated successfully`);
                    location.reload();
                } else {
                    alert("Failed to update order");
                }
            } catch (error) {
                console.error("Error updating order:", error);
                alert("Error updating order");
            }
        });
    });
}
