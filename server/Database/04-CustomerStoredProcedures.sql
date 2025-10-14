USE WeatherDB;
GO

-- Stored Procedure: Get Top Customers by Order Count
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_GetTopCustomersByOrderCount')
    DROP PROCEDURE sp_GetTopCustomersByOrderCount;
GO

CREATE PROCEDURE sp_GetTopCustomersByOrderCount
    @TopCount INT = 3
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT TOP (@TopCount)
        c.Id,
        c.CustomerName,
        c.Email,
        c.Phone,
        COUNT(o.Id) AS OrderCount,
        SUM(o.TotalAmount) AS TotalSpent,
        MAX(o.OrderDate) AS LastOrderDate
    FROM Customers c
    LEFT JOIN Orders o ON c.Id = o.CustomerId
    GROUP BY c.Id, c.CustomerName, c.Email, c.Phone
    HAVING COUNT(o.Id) > 0
    ORDER BY OrderCount DESC, TotalSpent DESC;
END
GO

-- Stored Procedure: Get All Customers with Order Counts
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_GetAllCustomersWithOrderCount')
    DROP PROCEDURE sp_GetAllCustomersWithOrderCount;
GO

CREATE PROCEDURE sp_GetAllCustomersWithOrderCount
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        c.Id,
        c.CustomerName,
        c.Email,
        c.Phone,
        c.CreatedAt,
        COUNT(o.Id) AS OrderCount,
        ISNULL(SUM(o.TotalAmount), 0) AS TotalSpent,
        MAX(o.OrderDate) AS LastOrderDate
    FROM Customers c
    LEFT JOIN Orders o ON c.Id = o.CustomerId
    GROUP BY c.Id, c.CustomerName, c.Email, c.Phone, c.CreatedAt
    ORDER BY OrderCount DESC, c.CustomerName;
END
GO

-- Stored Procedure: Get Customer by ID with Orders
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_GetCustomerById')
    DROP PROCEDURE sp_GetCustomerById;
GO

CREATE PROCEDURE sp_GetCustomerById
    @CustomerId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Get customer details
    SELECT 
        c.Id,
        c.CustomerName,
        c.Email,
        c.Phone,
        c.CreatedAt,
        COUNT(o.Id) AS OrderCount,
        ISNULL(SUM(o.TotalAmount), 0) AS TotalSpent,
        MAX(o.OrderDate) AS LastOrderDate
    FROM Customers c
    LEFT JOIN Orders o ON c.Id = o.CustomerId
    WHERE c.Id = @CustomerId
    GROUP BY c.Id, c.CustomerName, c.Email, c.Phone, c.CreatedAt;
    
    -- Get customer orders
    SELECT 
        Id,
        CustomerId,
        OrderDate,
        TotalAmount,
        Status
    FROM Orders
    WHERE CustomerId = @CustomerId
    ORDER BY OrderDate DESC;
END
GO

-- Stored Procedure: Get Customer Statistics
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_GetCustomerStatistics')
    DROP PROCEDURE sp_GetCustomerStatistics;
GO

CREATE PROCEDURE sp_GetCustomerStatistics
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        COUNT(DISTINCT c.Id) AS TotalCustomers,
        COUNT(o.Id) AS TotalOrders,
        ISNULL(SUM(o.TotalAmount), 0) AS TotalRevenue,
        ISNULL(AVG(o.TotalAmount), 0) AS AverageOrderValue
    FROM Customers c
    LEFT JOIN Orders o ON c.Id = o.CustomerId;
END
GO

PRINT 'Customer stored procedures created successfully.';

