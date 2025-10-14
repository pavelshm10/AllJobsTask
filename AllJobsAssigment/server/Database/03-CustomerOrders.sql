USE WeatherDB;
GO

-- Create Customers Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Customers')
BEGIN
    CREATE TABLE Customers (
        Id INT PRIMARY KEY IDENTITY(1,1),
        CustomerName NVARCHAR(100) NOT NULL,
        Email NVARCHAR(100),
        Phone NVARCHAR(20),
        CreatedAt DATETIME2 DEFAULT GETDATE()
    );
END
GO

-- Create Orders Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Orders')
BEGIN
    CREATE TABLE Orders (
        Id INT PRIMARY KEY IDENTITY(1,1),
        CustomerId INT NOT NULL,
        OrderDate DATETIME2 DEFAULT GETDATE(),
        TotalAmount DECIMAL(10, 2),
        Status NVARCHAR(50),
        FOREIGN KEY (CustomerId) REFERENCES Customers(Id)
    );
END
GO

-- Insert sample customers
IF NOT EXISTS (SELECT * FROM Customers)
BEGIN
    INSERT INTO Customers (CustomerName, Email, Phone)
    VALUES 
        ('John Smith', 'john.smith@email.com', '+1-555-0101'),
        ('Emma Johnson', 'emma.j@email.com', '+1-555-0102'),
        ('Michael Brown', 'michael.b@email.com', '+1-555-0103'),
        ('Sarah Davis', 'sarah.d@email.com', '+1-555-0104'),
        ('David Wilson', 'david.w@email.com', '+1-555-0105'),
        ('Lisa Anderson', 'lisa.a@email.com', '+1-555-0106'),
        ('James Taylor', 'james.t@email.com', '+1-555-0107'),
        ('Jennifer Martinez', 'jennifer.m@email.com', '+1-555-0108'),
        ('Robert Garcia', 'robert.g@email.com', '+1-555-0109'),
        ('Mary Rodriguez', 'mary.r@email.com', '+1-555-0110');
END
GO

-- Insert sample orders
IF NOT EXISTS (SELECT * FROM Orders)
BEGIN
    -- John Smith - 15 orders (highest)
    INSERT INTO Orders (CustomerId, OrderDate, TotalAmount, Status)
    SELECT 1, DATEADD(day, -number, GETDATE()), (number * 10.99), 'Completed'
    FROM master..spt_values WHERE type = 'P' AND number BETWEEN 1 AND 15;

    -- Emma Johnson - 12 orders (second highest)
    INSERT INTO Orders (CustomerId, OrderDate, TotalAmount, Status)
    SELECT 2, DATEADD(day, -number, GETDATE()), (number * 15.50), 'Completed'
    FROM master..spt_values WHERE type = 'P' AND number BETWEEN 1 AND 12;

    -- Michael Brown - 10 orders (third highest)
    INSERT INTO Orders (CustomerId, OrderDate, TotalAmount, Status)
    SELECT 3, DATEADD(day, -number, GETDATE()), (number * 20.00), 'Completed'
    FROM master..spt_values WHERE type = 'P' AND number BETWEEN 1 AND 10;

    -- Sarah Davis - 8 orders
    INSERT INTO Orders (CustomerId, OrderDate, TotalAmount, Status)
    SELECT 4, DATEADD(day, -number, GETDATE()), (number * 12.75), 'Completed'
    FROM master..spt_values WHERE type = 'P' AND number BETWEEN 1 AND 8;

    -- David Wilson - 5 orders
    INSERT INTO Orders (CustomerId, OrderDate, TotalAmount, Status)
    SELECT 5, DATEADD(day, -number, GETDATE()), (number * 18.99), 'Completed'
    FROM master..spt_values WHERE type = 'P' AND number BETWEEN 1 AND 5;

    -- Lisa Anderson - 3 orders
    INSERT INTO Orders (CustomerId, OrderDate, TotalAmount, Status)
    VALUES 
        (6, DATEADD(day, -1, GETDATE()), 45.99, 'Completed'),
        (6, DATEADD(day, -3, GETDATE()), 32.50, 'Completed'),
        (6, DATEADD(day, -5, GETDATE()), 67.25, 'Completed');

    -- James Taylor - 2 orders
    INSERT INTO Orders (CustomerId, OrderDate, TotalAmount, Status)
    VALUES 
        (7, DATEADD(day, -2, GETDATE()), 55.00, 'Pending'),
        (7, DATEADD(day, -4, GETDATE()), 28.75, 'Completed');

    -- Jennifer Martinez - 1 order
    INSERT INTO Orders (CustomerId, OrderDate, TotalAmount, Status)
    VALUES (8, DATEADD(day, -1, GETDATE()), 99.99, 'Completed');
END
GO

PRINT 'Customers and Orders tables created successfully with sample data.';

