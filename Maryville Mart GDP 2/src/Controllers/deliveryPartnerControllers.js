const db = require('../Database/db.js');

const getOrdersByDeliveryPartner = async (req, res) => {
    try {
      const { email } = req.query;
  
      if (!email) {
        return res.status(400).json({ message: "Missing delivery partner email" });
      }
  
      const [orders] = await db.execute(`
        SELECT 
          o.OrderID,
          o.OrderDate,
          o.CustomerID,
          o.CustomerName,
          o.Email,
          o.Phone,
          o.StreetAddress,
          o.Apartment,
          o.City,
          o.State,
          o.ZipCode,
          o.ShippingCost,
          p.TotalAmount,
          p.PaymentMethod,
          d.DeliveryStatus AS OrderStatus,
          d.DeliveryPartnerEmail,
          d.DeliveryUpdate,
          oi.Products,
          CASE 
            WHEN o.ShippingCost = 10.00 THEN 'Express Delivery'
            ELSE 'Standard Delivery'
          END AS DeliveryMethod
        FROM Orders o
        JOIN Payments p ON o.OrderID = p.OrderID
        JOIN OrderItems oi ON o.OrderID = oi.OrderID
        JOIN Deliveries d ON o.OrderID = d.OrderID
        WHERE d.DeliveryPartnerEmail = ?
        ORDER BY o.OrderDate DESC
      `, [email]);
  
  
      res.status(200).json(orders);
    } catch (error) {
      console.error("Error fetching delivery partner orders:", error);
      res.status(500).json({ message: "Internal server error" });
    }
};
  

module.exports = {
    getOrdersByDeliveryPartner
}