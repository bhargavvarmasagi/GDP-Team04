const db = require('../Database/db.js');
const { generateToken, verifyToken } = require('../Utils/jwtUtils.js');
const { sendResetPasswordEmail } = require('../Utils/emailService.js');
const bcrypt = require('bcryptjs');
const emails = require('../Utils/emailService.js');

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [user] = await db.execute('SELECT * FROM Admins WHERE Email = ?', [email]);
    if (user.length === 0) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    const isValidPassword = await bcrypt.compare(password, user[0].PasswordHash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    const token = generateToken(user[0].id);
    res.status(200).json({ token });
  } catch (error) {
    console.log("Error while login : ", error)
    res.status(500).json({ error: 'Error logging in' });
  }
};

const addProduct = async (req, res) => {
  const { ProductName, Category, Price, Description, StockQuantity, StoreID } = req.body;
  const imgUrl = req.file ? req.file.path : ''; 

  try {
    const query = `
      INSERT INTO Products (ProductName, Category, Price, Description, ImgUrl, StockQuantity, StoreID)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    await db.query(query, [ProductName, Category, Price, Description, imgUrl, StockQuantity, StoreID]);
    res.status(201).json({ message: 'Product added successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add product.' });
  }
};

const getProducts = async (req, res) => {
  try {
    const [products] = await db.query('SELECT * FROM Products');
    res.status(200).json(products);
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


const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { ProductName, Category, Price, Description, StockQuantity, StoreID } = req.body;

  console.log(req.body);

  try {
    const query = `
      UPDATE Products
      SET 
        ProductName = COALESCE(?, ProductName), 
        Category = COALESCE(?, Category), 
        Price = COALESCE(?, Price), 
        Description = COALESCE(?, Description), 
        StockQuantity = COALESCE(?, StockQuantity), 
        StoreID = COALESCE(?, StoreID)
      WHERE ProductID = ?
    `;

    const result = await db.query(query, [
      ProductName, Category, Price, Description, StockQuantity, StoreID, id
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Product not found." });
    }

    res.status(200).json({ message: "Product updated successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update product." });
  }
};



const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query('DELETE FROM Products WHERE ProductID = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    res.status(200).json({ message: 'Product deleted successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete product.' });
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


const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, deliveryPartnerEmail, deliveryUpdate } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Missing delivery status" });
    }

    const updateFields = ["DeliveryStatus = ?"];
    const values = [status];

    if (deliveryPartnerEmail !== undefined) {
      updateFields.push("DeliveryPartnerEmail = ?");
      values.push(deliveryPartnerEmail);
    }

    if (deliveryUpdate !== undefined) {
      updateFields.push("DeliveryUpdate = ?");
      values.push(deliveryUpdate);
    }

    values.push(orderId);

    const updateQuery = `
      UPDATE Deliveries
      SET ${updateFields.join(", ")}
      WHERE OrderID = ?
    `;

    const [result] = await db.execute(updateQuery, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Delivery status updated successfully" });

    if (status.toLowerCase() === "store pickup") {
  
      setTimeout(async () => {
        await db.execute(
          "UPDATE Deliveries SET DeliveryStatus = ? WHERE OrderID = ?",
          ["In Transit", orderId]
        );
        console.log(`Order ${orderId} auto-updated to In Transit`);

        setTimeout(async () => {
          await db.execute(
            "UPDATE Deliveries SET DeliveryStatus = ? WHERE OrderID = ?",
            ["Delivered", orderId]
          );
          console.log(`Order ${orderId} auto-updated to Delivered`);
        }, 30000);

      }, 30000);
    }

  } catch (error) {
    console.error("Error updating delivery status:", error);
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

const addStore = async (req, res) => {
  console.log(req.body)
  const { StoreName, Location, InventoryStatus, ContactPhone, ContactEmail } = req.body;

  try {
    const query = `
      INSERT INTO Stores (StoreName, Location, InventoryStatus, ContactPhone, ContactEmail)
      VALUES (?, ?, ?, ?, ?)
    `;
    await db.query(query, [StoreName, Location, InventoryStatus, ContactPhone, ContactEmail]);
    res.status(201).json({ message: 'Store added successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add store.' });
  }
};

const getStoreById = async (req, res) => {
  const { id } = req.params;

  try {
    const [store] = await db.query('SELECT * FROM Stores WHERE StoreID = ?', [id]);
    if (store.length === 0) {
      return res.status(404).json({ error: 'Store not found.' });
    }
    res.status(200).json(store[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch store.' });
  }
};

const updateStore = async (req, res) => {
  const { id } = req.params;
  const { StoreName, Location, InventoryStatus, ContactPhone, ContactEmail } = req.body;

  console.log(req.body);

  try {
    const query = `
      UPDATE Stores
      SET 
        StoreName = COALESCE(?, StoreName), 
        Location = COALESCE(?, Location), 
        InventoryStatus = COALESCE(?, InventoryStatus), 
        ContactPhone = COALESCE(?, ContactPhone), 
        ContactEmail = COALESCE(?, ContactEmail)
      WHERE StoreID = ?
    `;

    const result = await db.query(query, [
      StoreName, Location, InventoryStatus, ContactPhone, ContactEmail, id
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Store not found." });
    }

    res.status(200).json({ message: "Store updated successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update store." });
  }
};

const deleteStore = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query('DELETE FROM Stores WHERE StoreID = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Store not found.' });
    }

    res.status(200).json({ message: 'Store deleted successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete store.' });
  }
};



module.exports = {
    login,
    addProduct,
    updateProduct,
    getProducts,
    getProductById,
    deleteProduct,
    getOrders,
    updateOrderStatus,
    getStores,
    addStore,
    getStoreById,
    updateStore,
    deleteStore
}