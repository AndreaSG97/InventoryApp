IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'Inventory')
BEGIN
    CREATE DATABASE Inventory;
END
GO
use Inventory;

-- Create Products table
CREATE TABLE Products (
    ProductID INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
    Description NVARCHAR(MAX),
    Category NVARCHAR(50),
    Image NVARCHAR(255),
    Price DECIMAL(10, 2) NOT NULL,
    InStock INT NOT NULL DEFAULT 0
);


-- Create Transactions table
CREATE TABLE Transactions (
    TransactionID INT IDENTITY(1,1) PRIMARY KEY,
    Date DATETIME NOT NULL DEFAULT GETDATE(),
    TransactionType VARCHAR(10) CHECK (TransactionType IN ('purchase', 'sale')) NOT NULL,
    ProductID INT NOT NULL,
    Quantity INT NOT NULL,
    UnitPrice DECIMAL(10, 2) NOT NULL,
    TotalPrice AS (Quantity * UnitPrice) PERSISTED,
    Details NVARCHAR(MAX),
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
);

-- Insert data tables
INSERT INTO Products (Name, Description, Category, Image, Price, InStock) VALUES
('Laptop A', 'High-performance laptop', 'Electronics', null, 1200.00, 120),
('Smartphone X', 'Latest smartphone model', 'Electronics', null, 800.00, 100),
('Gaming Console', 'Next-gen gaming console', 'Gaming', null, 500.00, 150),
('Office Chair', 'Ergonomic office chair', 'Furniture', null, 150.00, 45),
('Wireless Mouse', 'Bluetooth enabled mouse', 'Accessories', null, 30.00, 10),
('Monitor 27"', '4K UHD monitor', 'Electronics', null, 300.00, 1),
('Keyboard Mechanical', 'Backlit mechanical keyboard', 'Accessories', null, 90.00, 25),
('USB-C Hub', 'Multiport USB-C hub', 'Accessories', null, 45.00, 3),
('Desk Lamp', 'Adjustable LED lamp', 'Furniture', null, 25.00, 2),
('Router AX3000', 'Wi-Fi 6 router', 'Networking', null, 120.00, 1);

INSERT INTO Transactions (TransactionType, ProductID, Quantity, UnitPrice, Details) VALUES
('purchase', 1, 10, 1100.00, 'Bulk laptop purchase'),
('sale', 1, 2, 1200.00, 'Sold 2 laptops to customer'),
('purchase', 2, 20, 750.00, 'Smartphones restock'),
('sale', 2, 5, 800.00, 'Sold 5 smartphones online'),
('purchase', 3, 15, 470.00, 'Console supplier delivery'),
('sale', 3, 3, 500.00, 'Store sale'),
('purchase', 4, 30, 140.00, 'Office chairs for inventory'),
('sale', 4, 4, 150.00, 'Sold to local office'),
('purchase', 5, 50, 25.00, 'Mouse stock updated'),
('sale', 5, 10, 30.00, 'Sold to school client');
