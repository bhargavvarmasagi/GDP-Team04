### Instructions for loading seed data
1. **Use the Database Management System (DBMS) Interface:** Log into your database management system using a graphical user interface like MySQL Workbench or a command-line interface like MySQL Command Line Client.<br>

2. **Create a New Database:** If you haven’t already created a database for the Maryville Grocery Delivery App, you can create it with the following command:
```
CREATE DATABASE maryville_grocery_delivery;
```

3. **Switch to the Database:** Select the new database so that all subsequent commands are executed within it.
```
USE maryville_grocery_delivery;
```

4. **Run the SQL Queries:** Copy each SQL statement provided and paste it into your database management tool (e.g., MySQL Workbench, phpMyAdmin, or your SQL console). This will allow you to create the necessary tables and insert sample data into each one.
```
-- Drop tables if they exist (for re-runs of this script)
DROP TABLE IF EXISTS Products, Stores, Customers, Reviews, Orders, OrderItems, Deliveries, Payments;
-- Table creation
CREATE TABLE Stores (
    StoreID INT PRIMARY KEY,
    StoreName VARCHAR(50),
    Location VARCHAR(100),
    ContactInfo VARCHAR(100)
);
CREATE TABLE Products (
    ProductID INT PRIMARY KEY,
    ProductName VARCHAR(50),
    Category VARCHAR(50),
    Price DECIMAL(10, 2),
    Description TEXT,
    StockQuantity INT,
    StoreID INT,
    FOREIGN KEY (StoreID) REFERENCES Stores(StoreID)
);
CREATE TABLE Customers (
    CustomerID INT PRIMARY KEY,
    FirstName VARCHAR(50),
    LastName VARCHAR(50),
    Email VARCHAR(100),
    PhoneNumber VARCHAR(20),
    PasswordHash VARCHAR(255),
    Address TEXT
);
CREATE TABLE Reviews (
    ReviewID INT PRIMARY KEY,
    Rating INT,
    ReviewText TEXT,
    ReviewDate DATE,
    ProductID INT,
    CustomerID INT,
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID),
    FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID)
);
CREATE TABLE Orders (
    OrderID INT PRIMARY KEY,
    OrderDate DATE,
    TotalAmount DECIMAL(10, 2),
    OrderStatus VARCHAR(20),
    CustomerID INT,
    FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID)
);
CREATE TABLE OrderItems (
    OrderItemID INT PRIMARY KEY,
    Quantity INT,
    Price DECIMAL(10, 2),
    OrderID INT,
    ProductID INT,
    FOREIGN KEY (OrderID) REFERENCES Orders(OrderID),
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
);
CREATE TABLE Deliveries (
    DeliveryID INT PRIMARY KEY,
    DeliveryStatus VARCHAR(50),
    EstimatedDeliveryTime DATE,
    GpsData JSON,  -- new GpsData attribute
    OrderID INT,
    FOREIGN KEY (OrderID) REFERENCES Orders(OrderID)
);
CREATE TABLE Payments (
    PaymentID INT PRIMARY KEY,
    PaymentMethod VARCHAR(20),
    Amount DECIMAL(10, 2),
    PaymentDate DATE,
    CustomerID INT,
    OrderID INT,
    FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID),
    FOREIGN KEY (OrderID) REFERENCES Orders(OrderID)
);

-- Sample data insertion
-- Stores (10 records)
INSERT INTO Stores (StoreID, StoreName, Location, ContactInfo) VALUES
(1, 'Blueway Market', '951 blueway St', '721-554-0687'),
(2, 'Lakeview grocery point', '183 Lakeview st', '321-755-8987'),
(3, 'River Valley Store', '256 Valley view rd', '221-333-0087'),
(4, 'Parkway Plaza', '889 Park Avenue', '361-444-0967'),
(5, 'Hilltop Market', '156 South frederick st', '621-252-5687'),
(6, 'Frederick Shop', '202 Riverbend Ln', '321-111-0999'),
(7, 'Seaside grocery outlet', '303 Seaside Dr', '321-459-0987'),
(8, 'Central Grocery Store', '404 North Frederick St', '321-588-0987'),
(9, 'Lakeshore Outlet', '805 Mvp Rd', '321-000-0987'),
(10, 'Hill Street Shop', '776 Mgm Rd', '321-324-0987');

-- Products (10 records with simpler items)
INSERT INTO Products (ProductID, ProductName, Category, Price, Description, StockQuantity, StoreID) VALUES
(1, 'Milk Chocolate', 'Snacks', 2.23, 'Creamy milk chocolate bar', 120, 1),
(2, 'Keeda Cola', 'Beverages', 2.55, 'Refreshing cola drink', 250, 2),
(3, 'Potato Chips', 'Snacks', 2.95, 'Crispy potato chips', 350, 3),
(4, 'Orange Juice', 'Beverages', 4.30, 'Freshly squeezed orange juice', 120, 4),
(5, 'Dark Chocolate', 'Snacks', 3.39, 'Rich dark chocolate bar with 70% cocoa', 220, 5),
(6, 'Sparkling Water', 'Beverages', 1.24, 'Lightly carbonated mineral water', 300, 6),
(7, 'Granola Bar', 'Snacks', 1.73, 'Healthy granola bar with nuts', 340, 7),
(8, 'Gatorade', 'Beverages', 1.81, 'Refreshing drink', 340, 8),
(9, 'Peanut Butter Cups', 'Snacks', 2.53, 'Chocolate cups filled with peanut butter', 225, 9),
(10, 'Black Tea', 'Beverages', 1.95, 'Organic', 512, 10);

-- Customers (10 records)
INSERT INTO Customers (CustomerID, FirstName, LastName, Email, PhoneNumber, PasswordHash, Address) VALUES
(1, 'Rohit', 'Sharma', 'hitman@gmail.com', '660-456-9890', 'hashed_password_1', '623 North frederick St'),
(2, 'Yuvraj', 'Singh', 'yuvi@gmail.com', '660-555-8790', 'hashed_password_2', '496 Parkway St'),
(3, 'Adam', 'Gilchrist', 'gilly@gmail.com', '923-454-7390', 'hashed_password_3', '789 Pine St'),
(4, 'Ben','Stokes', 'stokesy@gmail.com', '657-393-7890', 'hashed_password_4', '101 North St'),
(5, 'Glenn', 'Maxwell', 'maxi@gmail.com', '600-219-7590', 'hashed_password_5', '202 Birth St'),
(6, 'Jos', 'Buttler', 'jostheboss@gmail.com', '355-111-7390', 'hashed_password_6', '303 Conway St'),
(7, 'Kane', 'Williamson', 'kane@gmail.com', '456-099-2290', 'hashed_password_7', '404 David St'),
(8, 'Steve', 'Smith', 'smudge@gmail.com', '523-888-4578', 'hashed_password_8', '505 Spruce St'),
(9, 'Rishabh', 'Pant', 'spidey@gmail.com', '723-777-7895', 'hashed_password_9', '606 Willow St'),
(10, 'Mitchell', 'Starc', 'starcmitchell@gmail.com', '223-366-7890', 'hashed_password_10', '707 Cherry St');

-- Reviews (10 records)
INSERT INTO Reviews (ReviewID, Rating, ReviewText, ReviewDate, ProductID, CustomerID) VALUES
(1, 5, 'Excellent chocolate!', '2023-11-01', 1, 1),
(2, 4, 'Very refreshing', '2023-05-15', 2, 2),
(3, 3, 'not good and not bad', '2023-03-22', 3, 3),
(4, 5, 'Best one I ever had!', '2023-10-10', 4, 4),
(5, 2, 'Too bitter', '2023-05-15', 5, 5),
(6, 4, 'Good sparkling water.', '2023-06-28', 6, 6),
(7, 1, 'Not enjoyable.', '2023-06-17', 7, 7),
(8, 5, 'Loved the drink', '2023-06-23', 8, 8),
(9, 3, 'It is too sweet', '2023-09-19', 9, 9),
(10, 4, 'Nice flavor.', '2023-10-25', 10, 10);

-- Orders (10 records)
INSERT INTO Orders (OrderID, OrderDate, TotalAmount, OrderStatus, CustomerID) VALUES
(1, '2023-03-01', 2.99, 'Shipped', 1),
(2, '2023-03-02', 1.50, 'Delivered', 2),
(3, '2023-03-03', 1.99, 'Pending', 3),
(4, '2023-03-04', 2.50, 'Cancelled', 4),
(5, '2023-03-05', 3.49, 'Shipped', 5),
(6, '2023-03-06', 1.20, 'Processing', 6),
(7, '2023-03-07', 1.75, 'Delivered', 7),
(8, '2023-03-08', 1.80, 'Shipped', 8),
(9, '2023-03-09', 2.50, 'Processing', 9),
(10, '2023-03-10', 1.99, 'Delivered', 10);

-- OrderItems (10 records)
INSERT INTO OrderItems (OrderItemID, Quantity, Price, OrderID, ProductID) VALUES
(1, 1, 2.99, 1, 1),
(2, 1, 1.50, 2, 2),
(3, 1, 1.99, 3, 3),
(4, 1, 2.50, 4, 4),
(5, 1, 3.49, 5, 5),
(6, 1, 1.20, 6, 6),
(7, 1, 1.75, 7, 7),
(8, 1, 1.80, 8, 8),
(9, 1, 2.50, 9, 9),
(10, 1, 1.99, 10, 10);

-- Deliveries (10 records)
INSERT INTO Deliveries (DeliveryID, DeliveryStatus, EstimatedDeliveryTime, GpsData, OrderID) VALUES
(1, 'Delivered', '2023-03-05', '{"latitude": 40.7128, "longitude": -74.0060}', 1),
(2, 'Shipped', '2023-03-06', '{"latitude": 34.0522, "longitude": -118.2437}', 2),
(3, 'In Transit', '2023-03-07', '{"latitude": 41.8781, "longitude": -87.6298}', 3),
(4, 'Pending', '2023-03-08', '{"latitude": 29.7604, "longitude": -95.3698}', 4),
(5, 'Delivered', '2023-03-09', '{"latitude": 51.5074, "longitude": -0.1278}', 5),
(6, 'Processing', '2023-03-10', '{"latitude": 48.8566, "longitude": 2.3522}', 6),
(7, 'Delivered', '2023-03-11', '{"latitude": 35.6895, "longitude": 139.6917}', 7),
(8, 'Shipped', '2023-03-12', '{"latitude": -33.8688, "longitude": 151.2093}', 8),
(9, 'In Transit', '2023-03-13', '{"latitude": 55.7558, "longitude": 37.6176}', 9),
(10, 'Delivered', '2023-03-14', '{"latitude": 40.7306, "longitude": -73.9352}', 10);

-- Payments (10 records)
INSERT INTO Payments (PaymentID, PaymentMethod, Amount, PaymentDate, CustomerID, OrderID) VALUES
(1, 'Credit Card', 2.99, '2023-03-01', 1, 1),
(2, 'Debit Card', 1.50, '2023-03-02', 2, 2),
(3, 'PayPal', 1.99, '2023-03-03', 3, 3),
(4, 'Credit Card', 2.50, '2023-03-04', 4, 4),
(5, 'Credit Card', 3.49, '2023-03-05', 5, 5),
(6, 'Debit Card', 1.20, '2023-03-06', 6, 6),
(7, 'PayPal', 1.75, '2023-03-07', 7, 7),
(8, 'Credit Card', 1.80, '2023-03-08', 8, 8),
(9, 'Debit Card', 2.50, '2023-03-09', 9, 9),
(10, 'PayPal', 1.99, '2023-03-10', 10, 10);
```
5. **Verify the Data:** To confirm that data was successfully entered, run the following SELECT statements:-
```
SELECT * FROM Stores;
SELECT * FROM Products;
SELECT * FROM Customers;
SELECT * FROM Reviews;
SELECT * FROM Orders;
SELECT * FROM OrderItems;
SELECT * FROM Deliveries;
SELECT * FROM Payments;
```
