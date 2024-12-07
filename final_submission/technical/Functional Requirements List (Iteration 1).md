**Functional Requirements**<br/>
**The system SHALL**:<br/>
**1.Store Catalog**:<br/>
The system SHALL display a store catalog which includes products with complete details and images.<br/>
The system SHALL offer filtering choices (by price,category, etc.) and search functions for finding products.<br/>
**2.Online Ordering**:<br/>
The system SHALL connect with store inventory systems through APIs to verify availability of product instantly.<br/>
The system SHALL enable customers to add items to a shopping cart and place orders online.<br/>
**3.Payment Handling**:<br/>
The system SHALL handle payments through a protected platform that accommodates saved payment methods.<br/>
**4. Order Tracking and Shipment Status**:<br>
The system SHALL provide live updates on order tracking and delivery status.<br>
The system SHALL offer GPS-based live tracking of delivery personnel.<br>
**5.Order Status Updates**:<br>
The system SHALL alert users regarding their order status (confirmed, shipped, in transit, delivered).<br>
**6.Data Security**:<br>
The system SHALL secure sensitive user data, including personal details and order information, by encrypting it.<br>
**7.Customer Reviews and Ratings**:<br>
The system SHALL permit users to post reviews and ratings for stores and items.<br>
**8.Relational Database**:<br>
The system SHALL build a relational database to handle and maintain every information about items, orders, and clients.<br>

**The system SHOULD**:<br>
**9. Location-Based Support**:<br>
The system SHOULD make advantage of location-based services to provide appropriate delivery time forecasts depending on the user's present location.<br>
**10. Load Distribution**:<br>
The system SHOULD set up times of high traffic by implementing load-balancing techniques into practice.<br>
**11.Messages to Delivery Staff**:<br>
The system SHOULD send detailed instructions for shipment to delivery staff and let them know when an order is ready for pickup.<br>
**12.Various Delivery Choices**:<br>
The system SHOULD offer a variety of delivery alternatives for users to select from, such as same-day and next-day delivery.<br>

**The system MAY**:<br>
**13. Product and Store Suggestions**:<br>
The system MAY suggest products and stores depending on the customer's previous orders and interests.<br>
**14. Saved Payment Options**:<br>
The system MAY allow customers to save payment methods to use in future transactions.<br>
**15. Notifications of Store Supplies**:<br>
The system MAY Notify customers when the goods that are currently out of stock become available.<br>
**16. The integration of Third Parties**:<br>
The system MAY connect with outside applications to provide grocery recommendations based on user behavior.<br>

**The system SHALL NOT**:<br>
**17. Data Management**:<br>
The system SHALL NOT store the details of a customer that is in an unencrypted manner.<br>
The system SHALL NOT provide important or private information to unknown organizations.<br>
**18. Performance Problems**:<br>
The system SHALL NOT experience a considerable reduction in efficiency at times of high demand because of insufficient load distribution.<br>

