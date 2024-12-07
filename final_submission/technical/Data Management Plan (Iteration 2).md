1.Summary of Data to Store:<br>
The data to be stored for the Maryville Grocery Delivery App includes the following fields. These represent an overview of the system's key components and are presented in a way accessible to non-technical readers:<br>
o User Information: Name, address, email, phone number, payment methods (encrypted), and login credentials.<br>
o Order Details: Order ID, product details (item name, quantity, price), order total, and delivery address.
o Product Catalog: Product ID, name, description, price, availability status, and images.<br>
o Store Information: Store ID, name, location, inventory status, and contact information.<br>
o Delivery Data: Delivery ID, delivery person details, GPS coordinates, estimated delivery time, and current status (en-route, delivered).<br>
o Customer Reviews and Ratings: Review ID, product/store ID, user ID, rating, and review text.<br>
o Payment Information: Transaction ID, amount, method (credit card, wallet), and payment status (pending, completed) – all encrypted.<br>
o Real-time Tracking Data: GPS updates for delivery personnel every 10 seconds.<br>

2.ER Diagram:<br>
The ER Diagram (Entity-Relationship Diagram) visually represents the relationships between the different entities mentioned above (Users, Orders, Products, Stores, Deliveries, and Reviews). It helps the client understand how data is interconnected within the system. This diagram will also serve as a foundation for implementing the database schema.<br>
Key Entities:<br>
o Customers<br>
o Orders<br>
o OrderItems<br>
o Products<br>
o Stores<br>
o Deliveries<br>
o Reviews<br>
o Payments<br>

![Alt text](https://github.com/bhargavvarmasagi/GDP-Team04/blob/main/Er%20Diagram%20Iteration%202.png)

3.Data Security:<br>
Initial plans for securing data include:<br>
o Access Restriction: Implementing role-based access control (RBAC) to ensure that sensitive data is only accessible by authorized users (e.g., only store managers can update inventory, only admins can access payment details).<br>
o Encryption: All sensitive information, including personal user data and payment information, will be encrypted using AES-256 during both transmission and at rest. This ensures that even if data is intercepted or accessed, it remains secure.<br>
o PCI Compliance: To ensure safe payment processing, the system will adhere to PCI-DSS standards, protecting all customer payment transactions.<br>

4.Mapping of Functional Requirements to Data Storage:<br>
Each functional requirement of the app correlates with specific data fields in the database:<br>
o Store Catalog with Search and Filtering: Requires data fields from the Product Catalog (e.g., product ID, name, description, availability) to allow for efficient searching.<br>
o Order Tracking and Delivery Status Updates: Relies on real-time updates from the Delivery Data (e.g., delivery ID, GPS coordinates).<br>
o Customer Reviews and Ratings: Uses the Reviews entity to store feedback and ratings provided by customers.<br>
o Payment Processing: Connects to the Payment Information entity, ensuring encrypted storage of transaction data.<br>
o Location-Based Services: Depends on GPS data stored in the Delivery Data to provide accurate delivery estimates.



