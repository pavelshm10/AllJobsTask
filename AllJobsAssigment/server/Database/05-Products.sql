USE WeatherDB;
GO

-- Create Products Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Products')
BEGIN
    CREATE TABLE Products (
        Id INT PRIMARY KEY IDENTITY(1,1),
        ProductName NVARCHAR(100) NOT NULL,
        Category NVARCHAR(50) NOT NULL,
        Supplier NVARCHAR(100) NOT NULL,
        UnitPrice DECIMAL(10, 2) NOT NULL,
        Units INT NOT NULL,
        CreatedAt DATETIME2 DEFAULT GETDATE(),
        UpdatedAt DATETIME2 DEFAULT GETDATE()
    );
END
GO

-- Insert sample products
IF NOT EXISTS (SELECT * FROM Products)
BEGIN
    INSERT INTO Products (ProductName, Category, Supplier, UnitPrice, Units)
    VALUES 
        -- Electronics
        ('Wireless Mouse', 'Electronics', 'Logitech Inc.', 29.99, 150),
        ('USB-C Cable', 'Electronics', 'Anker Technologies', 12.99, 300),
        ('Bluetooth Headphones', 'Electronics', 'Sony Corporation', 89.99, 75),
        ('Laptop Stand', 'Electronics', 'Rain Design', 49.99, 120),
        ('Mechanical Keyboard', 'Electronics', 'Corsair Gaming', 129.99, 60),
        
        -- Office Supplies
        ('A4 Paper Pack', 'Office Supplies', 'Staples Inc.', 8.99, 500),
        ('Blue Pen Box', 'Office Supplies', 'BIC Corporation', 4.99, 800),
        ('Sticky Notes', 'Office Supplies', '3M Company', 6.49, 450),
        ('File Folders', 'Office Supplies', 'Pendaflex', 12.99, 200),
        ('Desk Organizer', 'Office Supplies', 'SimpleHouseware', 18.99, 90),
        
        -- Furniture
        ('Office Chair', 'Furniture', 'Herman Miller', 599.99, 25),
        ('Standing Desk', 'Furniture', 'FlexiSpot', 399.99, 30),
        ('Bookshelf', 'Furniture', 'IKEA', 79.99, 45),
        ('Desk Lamp', 'Furniture', 'TaoTronics', 35.99, 110),
        
        -- Software
        ('Antivirus License', 'Software', 'Norton Security', 39.99, 1000),
        ('Office Suite', 'Software', 'Microsoft', 149.99, 500),
        ('Adobe Creative Cloud', 'Software', 'Adobe Systems', 54.99, 200),
        
        -- Accessories
        ('Mouse Pad', 'Accessories', 'SteelSeries', 14.99, 250),
        ('Cable Management', 'Accessories', 'D-Line', 9.99, 180),
        ('Monitor Screen Cleaner', 'Accessories', 'WHOOSH!', 11.99, 300),
        
        -- Food & Beverage
        ('Coffee Beans 1kg', 'Food & Beverage', 'Starbucks', 24.99, 85),
        ('Tea Variety Pack', 'Food & Beverage', 'Twinings', 16.99, 120),
        ('Energy Drink 24pk', 'Food & Beverage', 'Red Bull', 34.99, 65),
        ('Protein Bars Box', 'Food & Beverage', 'Quest Nutrition', 28.99, 95),
        
        -- Books
        ('Clean Code Book', 'Books', 'Prentice Hall', 42.99, 40),
        ('Design Patterns', 'Books', "O'Reilly Media", 54.99, 35),
        ('JavaScript Guide', 'Books', 'Manning Publications', 39.99, 50),
        
        -- Health & Wellness
        ('Ergonomic Wrist Rest', 'Health & Wellness', 'Fellowes', 19.99, 140),
        ('Blue Light Glasses', 'Health & Wellness', 'GUNNAR Optiks', 49.99, 70),
        ('Standing Mat', 'Health & Wellness', 'Topo Comfort', 89.99, 55);
END
GO

PRINT 'Products table created successfully with sample data.';

