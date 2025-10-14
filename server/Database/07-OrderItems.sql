USE WeatherDB;
GO

-- Create OrderItems Table (junction table between Orders and Products)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'OrderItems')
BEGIN
    CREATE TABLE OrderItems (
        Id INT PRIMARY KEY IDENTITY(1,1),
        OrderId INT NOT NULL,
        ProductId INT NOT NULL,
        Quantity INT NOT NULL,
        UnitPrice DECIMAL(10, 2) NOT NULL,
        FOREIGN KEY (OrderId) REFERENCES Orders(Id) ON DELETE CASCADE,
        FOREIGN KEY (ProductId) REFERENCES Products(Id)
    );
    
    -- Create indexes for better query performance
    CREATE INDEX IX_OrderItems_OrderId ON OrderItems(OrderId);
    CREATE INDEX IX_OrderItems_ProductId ON OrderItems(ProductId);
END
GO

-- Insert sample order items (linking orders to products)
IF NOT EXISTS (SELECT * FROM OrderItems)
BEGIN
    -- John Smith's orders (some with electronics and office supplies)
    INSERT INTO OrderItems (OrderId, ProductId, Quantity, UnitPrice)
    VALUES 
        (1, 1, 2, 29.99),   -- Wireless Mouse
        (1, 7, 5, 4.99),    -- Blue Pen Box
        (2, 3, 1, 89.99),   -- Bluetooth Headphones
        (3, 6, 10, 8.99),   -- A4 Paper Pack
        (4, 15, 1, 39.99),  -- Antivirus License
        (5, 1, 1, 29.99),   -- Wireless Mouse
        (6, 18, 3, 14.99),  -- Mouse Pad
        (7, 21, 2, 24.99),  -- Coffee Beans
        (8, 2, 5, 12.99),   -- USB-C Cable
        (9, 8, 10, 6.49),   -- Sticky Notes
        (10, 4, 2, 49.99),  -- Laptop Stand
        (11, 16, 1, 149.99),-- Office Suite
        (12, 22, 3, 16.99), -- Tea Variety Pack
        (13, 14, 1, 35.99), -- Desk Lamp
        (14, 28, 1, 19.99), -- Ergonomic Wrist Rest
        (15, 5, 1, 129.99); -- Mechanical Keyboard
    
    -- Emma Johnson's orders (furniture and software heavy)
    INSERT INTO OrderItems (OrderId, ProductId, Quantity, UnitPrice)
    VALUES 
        (16, 11, 1, 599.99), -- Office Chair
        (17, 12, 1, 399.99), -- Standing Desk
        (18, 16, 1, 149.99), -- Office Suite
        (19, 17, 1, 54.99),  -- Adobe Creative Cloud
        (20, 13, 2, 79.99),  -- Bookshelf
        (21, 14, 3, 35.99),  -- Desk Lamp
        (22, 10, 5, 18.99),  -- Desk Organizer
        (23, 30, 1, 89.99),  -- Standing Mat
        (24, 29, 2, 49.99),  -- Blue Light Glasses
        (25, 3, 1, 89.99),   -- Bluetooth Headphones
        (26, 4, 1, 49.99),   -- Laptop Stand
        (27, 1, 1, 29.99);   -- Wireless Mouse
    
    -- Michael Brown's orders (books and software)
    INSERT INTO OrderItems (OrderId, ProductId, Quantity, UnitPrice)
    VALUES 
        (28, 25, 1, 42.99),  -- Clean Code Book
        (29, 26, 1, 54.99),  -- Design Patterns
        (30, 27, 1, 39.99),  -- JavaScript Guide
        (31, 16, 1, 149.99), -- Office Suite
        (32, 17, 1, 54.99),  -- Adobe Creative Cloud
        (33, 15, 2, 39.99),  -- Antivirus License
        (34, 5, 1, 129.99),  -- Mechanical Keyboard
        (35, 3, 1, 89.99),   -- Bluetooth Headphones
        (36, 1, 1, 29.99),   -- Wireless Mouse
        (37, 4, 1, 49.99);   -- Laptop Stand
END
GO

PRINT 'OrderItems table created successfully with sample data.';

