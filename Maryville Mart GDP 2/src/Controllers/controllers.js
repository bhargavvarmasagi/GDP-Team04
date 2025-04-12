const db = require('../Database/db.js');


const getProducts = async (req, res) => {
  try {
    const [products] = await db.query('SELECT * FROM Products');
    res.status(200).send({ products : products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch products.' });
  }
};


const getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const [product] = await db.query('SELECT * FROM Products WHERE ProductID = ?', [id]);
    if (product.length === 0) {
      return res.status(404).json({ error: 'Product not found.' });
    }
    res.status(200).json(product[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch product.' });
  }
};

const addOrder = async (req, res) => {
  try {
    const {
      customerID,
      totalAmount,
      products,
      shipping,
      deliveryMethod,
      paymentMethod
    } = req.body;

    if (
      !customerID ||
      !totalAmount ||
      !products ||
      !shipping ||
      !deliveryMethod ||
      !paymentMethod
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const productsJSON = JSON.stringify(products);
    const {
      firstName,
      lastName,
      email,
      phone,
      street,
      apartment,
      city,
      state,
      zip
    } = shipping;

    const customerName = `${firstName} ${lastName}`;
    const shippingCost = deliveryMethod === "Express Delivery" ? 10.0 : 5.0;


    const [orderResult] = await db.execute(
      `INSERT INTO Orders 
        (CustomerID, CustomerName, Email, Phone, StreetAddress, Apartment, City, State, ZipCode, ShippingCost)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        customerID,
        customerName,
        email,
        phone,
        street,
        apartment,
        city,
        state,
        zip,
        shippingCost
      ]
    );

    const orderID = orderResult.insertId;

    await db.execute(
      `INSERT INTO Payments (TotalAmount, CustomerID, PaymentMethod, OrderID)
       VALUES (?, ?, ?, ?)`,
      [totalAmount, customerID, paymentMethod, orderID]
    );

    await db.execute(
      `INSERT INTO OrderItems (OrderID, Products)
       VALUES (?, ?)`,
      [orderID, productsJSON]
    );

    await db.execute(
      `INSERT INTO Deliveries (OrderID, DeliveryStatus)
       VALUES (?, ?)`,
      [orderID, "Pending"]
    );

    res
      .status(201)
      .json({ message: "Order added successfully", orderID: orderID });
  } catch (error) {
    console.error("Error adding order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



const getOrders = async (req, res) => {
  try {
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
      ORDER BY o.OrderDate DESC
    `);

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const getOrderById = async (req, res) => {
  try {
      const { id } = req.params;
      const [order] = await db.execute("SELECT * FROM Orders WHERE OrderID = ?", [id]);

      if (order.length === 0) {
          return res.status(404).json({ message: "Order not found" });
      }

      res.status(200).json(order[0]);
  } catch (error) {
      console.error("Error fetching order:", error);
      res.status(500).json({ message: "Internal server error" });
  }
};


const deleteOrder = async (req, res) => {
  try {
      const { id } = req.params;

      const [result] = await db.execute("DELETE FROM Orders WHERE OrderID = ?", [id]);

      if (result.affectedRows === 0) {
          return res.status(404).json({ message: "Order not found" });
      }

      res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
      console.error("Error deleting order:", error);
      res.status(500).json({ message: "Internal server error" });
  }
};

const getStores = async (req, res) => {
  try {
      const [stores] = await db.execute("SELECT * FROM Stores ORDER BY StoreID DESC");
      res.status(200).json(stores);
  } catch (error) {
      console.error("Error fetching stores:", error);
      res.status(500).json({ message: "Internal server error" });
  }
};


const addReview = async (req, res) => {
  try {
      const { ProductID, CustomerID, Rating, ReviewText } = req.body;

      if (!ProductID || !CustomerID || !Rating || Rating < 0 || Rating > 5) {
          return res.status(400).json({ message: 'Invalid input. Required fields: ProductID, CustomerID, Rating (0-5)' });
      }

      const [result] = await db.execute(
          `INSERT INTO Reviews 
          (ProductID, CustomerID, Rating, ReviewText, ReviewDate)
          VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)`,
          [ProductID, CustomerID, Rating, ReviewText]
      );

      res.status(201).json({ 
          message: 'Review added successfully!',
          reviewID: result.insertId 
      });
  } catch (error) {
      console.error('Error adding review:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
};


const getReviews = async (req, res) => {
  try {
      const { ProductID } = req.query;
      let query = 'SELECT * FROM Reviews';
      let params = [];

      if (ProductID) {
          query += ' WHERE ProductID = ?';
          params.push(ProductID);
      }

      const [reviews] = await db.execute(query, params);
      
      if (reviews.length === 0) {
          return res.status(404).json({ message: 'No reviews found' });
      }
      
      res.status(200).json(reviews);
  } catch (error) {
      console.error('Error fetching reviews:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
};


const deleteReview = async (req, res) => {
  try {
      const { reviewID } = req.params;

      if (!reviewID) {
          return res.status(400).json({ message: 'Review ID required' });
      }

      const [result] = await db.execute(
          'DELETE FROM Reviews WHERE ReviewID = ?',
          [reviewID]
      );

      if (result.affectedRows === 0) {
          return res.status(404).json({ message: 'Review not found' });
      }

      res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
      console.error('Error deleting review:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
};


module.exports = {
    getProducts,
    getProductById,
    getOrders,
    getOrderById,
    addOrder,
    deleteOrder,
    getStores,
    addReview,
    getReviews,
    deleteReview
}