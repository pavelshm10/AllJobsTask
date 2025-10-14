USE WeatherDB;
GO

-- Stored Procedure: Get All Weather Forecasts
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_GetAllWeatherForecasts')
    DROP PROCEDURE sp_GetAllWeatherForecasts;
GO

CREATE PROCEDURE sp_GetAllWeatherForecasts
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        Id,
        Date,
        TemperatureC,
        TemperatureF,
        Summary,
        CreatedAt,
        UpdatedAt
    FROM WeatherForecasts
    ORDER BY Date;
END
GO

-- Stored Procedure: Get Weather Forecast by ID
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_GetWeatherForecastById')
    DROP PROCEDURE sp_GetWeatherForecastById;
GO

CREATE PROCEDURE sp_GetWeatherForecastById
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        Id,
        Date,
        TemperatureC,
        TemperatureF,
        Summary,
        CreatedAt,
        UpdatedAt
    FROM WeatherForecasts
    WHERE Id = @Id;
END
GO

-- Stored Procedure: Insert Weather Forecast
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_InsertWeatherForecast')
    DROP PROCEDURE sp_InsertWeatherForecast;
GO

CREATE PROCEDURE sp_InsertWeatherForecast
    @Date DATETIME2,
    @TemperatureC INT,
    @Summary NVARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO WeatherForecasts (Date, TemperatureC, Summary)
    VALUES (@Date, @TemperatureC, @Summary);
    
    SELECT 
        Id,
        Date,
        TemperatureC,
        TemperatureF,
        Summary,
        CreatedAt,
        UpdatedAt
    FROM WeatherForecasts
    WHERE Id = SCOPE_IDENTITY();
END
GO

-- Stored Procedure: Update Weather Forecast
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_UpdateWeatherForecast')
    DROP PROCEDURE sp_UpdateWeatherForecast;
GO

CREATE PROCEDURE sp_UpdateWeatherForecast
    @Id INT,
    @Date DATETIME2,
    @TemperatureC INT,
    @Summary NVARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE WeatherForecasts
    SET 
        Date = @Date,
        TemperatureC = @TemperatureC,
        Summary = @Summary,
        UpdatedAt = GETDATE()
    WHERE Id = @Id;
    
    SELECT 
        Id,
        Date,
        TemperatureC,
        TemperatureF,
        Summary,
        CreatedAt,
        UpdatedAt
    FROM WeatherForecasts
    WHERE Id = @Id;
END
GO

-- Stored Procedure: Delete Weather Forecast
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_DeleteWeatherForecast')
    DROP PROCEDURE sp_DeleteWeatherForecast;
GO

CREATE PROCEDURE sp_DeleteWeatherForecast
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;
    
    DELETE FROM WeatherForecasts
    WHERE Id = @Id;
    
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO

