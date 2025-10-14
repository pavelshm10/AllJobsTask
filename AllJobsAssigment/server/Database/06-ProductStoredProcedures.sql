USE WeatherDB;
GO

-- Stored Procedure: Get All Products
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_GetAllProducts')
    DROP PROCEDURE sp_GetAllProducts;
GO

CREATE PROCEDURE sp_GetAllProducts
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        Id,
        ProductName,
        Category,
        Supplier,
        UnitPrice,
        Units,
        CreatedAt,
        UpdatedAt
    FROM Products
    ORDER BY ProductName;
END
GO

-- Stored Procedure: Get Product by ID
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_GetProductById')
    DROP PROCEDURE sp_GetProductById;
GO

CREATE PROCEDURE sp_GetProductById
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        Id,
        ProductName,
        Category,
        Supplier,
        UnitPrice,
        Units,
        CreatedAt,
        UpdatedAt
    FROM Products
    WHERE Id = @Id;
END
GO

-- Stored Procedure: Get Products by Category
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_GetProductsByCategory')
    DROP PROCEDURE sp_GetProductsByCategory;
GO

CREATE PROCEDURE sp_GetProductsByCategory
    @Category NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        Id,
        ProductName,
        Category,
        Supplier,
        UnitPrice,
        Units,
        CreatedAt,
        UpdatedAt
    FROM Products
    WHERE Category = @Category
    ORDER BY ProductName;
END
GO

-- Stored Procedure: Insert Product
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_InsertProduct')
    DROP PROCEDURE sp_InsertProduct;
GO

CREATE PROCEDURE sp_InsertProduct
    @ProductName NVARCHAR(100),
    @Category NVARCHAR(50),
    @Supplier NVARCHAR(100),
    @UnitPrice DECIMAL(10, 2),
    @Units INT
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO Products (ProductName, Category, Supplier, UnitPrice, Units)
    VALUES (@ProductName, @Category, @Supplier, @UnitPrice, @Units);
    
    SELECT 
        Id,
        ProductName,
        Category,
        Supplier,
        UnitPrice,
        Units,
        CreatedAt,
        UpdatedAt
    FROM Products
    WHERE Id = SCOPE_IDENTITY();
END
GO

-- Stored Procedure: Update Product
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_UpdateProduct')
    DROP PROCEDURE sp_UpdateProduct;
GO

CREATE PROCEDURE sp_UpdateProduct
    @Id INT,
    @ProductName NVARCHAR(100),
    @Category NVARCHAR(50),
    @Supplier NVARCHAR(100),
    @UnitPrice DECIMAL(10, 2),
    @Units INT
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE Products
    SET 
        ProductName = @ProductName,
        Category = @Category,
        Supplier = @Supplier,
        UnitPrice = @UnitPrice,
        Units = @Units,
        UpdatedAt = GETDATE()
    WHERE Id = @Id;
    
    SELECT 
        Id,
        ProductName,
        Category,
        Supplier,
        UnitPrice,
        Units,
        CreatedAt,
        UpdatedAt
    FROM Products
    WHERE Id = @Id;
END
GO

-- Stored Procedure: Delete Product (with CASCADE option)
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_DeleteProduct')
    DROP PROCEDURE sp_DeleteProduct;
GO

CREATE PROCEDURE sp_DeleteProduct
    @Id INT,
    @Cascade BIT = 0  -- Optional: 1 = cascade delete, 0 = prevent deletion (default)
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Check if product exists
    IF NOT EXISTS (SELECT 1 FROM Products WHERE Id = @Id)
    BEGIN
        -- Return 0 to indicate product not found
        SELECT 0 AS RowsAffected;
        RETURN;
    END
    
    -- Check if product is referenced in any order
    IF EXISTS (SELECT 1 FROM OrderItems WHERE ProductId = @Id)
    BEGIN
        IF @Cascade = 1
        BEGIN
            -- CASCADE: Delete order items first
            DELETE FROM OrderItems WHERE ProductId = @Id;
        END
        ELSE
        BEGIN
            -- PREVENT: Throw error
            DECLARE @ProductName NVARCHAR(100);
            SELECT @ProductName = ProductName FROM Products WHERE Id = @Id;
            
            DECLARE @ErrorMessage NVARCHAR(500);
            SET @ErrorMessage = 'Cannot delete product ''' + @ProductName + ''' because it is referenced in existing orders. Please remove it from all orders first.';
            
            THROW 50001, @ErrorMessage, 1;
            RETURN;
        END
    END
    
    -- Safe to delete
    DELETE FROM Products WHERE Id = @Id;
    
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO

PRINT 'Product stored procedures created successfully.';

