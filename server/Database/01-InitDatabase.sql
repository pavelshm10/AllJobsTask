-- Create Database
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'WeatherDB')
BEGIN
    CREATE DATABASE WeatherDB;
END
GO

USE WeatherDB;
GO

-- Create WeatherForecast Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'WeatherForecasts')
BEGIN
    CREATE TABLE WeatherForecasts (
        Id INT PRIMARY KEY IDENTITY(1,1),
        Date DATETIME2 NOT NULL,
        TemperatureC INT NOT NULL,
        TemperatureF AS (32 + (TemperatureC * 9 / 5)),
        Summary NVARCHAR(100),
        CreatedAt DATETIME2 DEFAULT GETDATE(),
        UpdatedAt DATETIME2 DEFAULT GETDATE()
    );
END
GO

-- Insert sample data
IF NOT EXISTS (SELECT * FROM WeatherForecasts)
BEGIN
    INSERT INTO WeatherForecasts (Date, TemperatureC, Summary)
    VALUES 
        (DATEADD(day, 1, GETDATE()), 15, 'Cool'),
        (DATEADD(day, 2, GETDATE()), 22, 'Warm'),
        (DATEADD(day, 3, GETDATE()), -5, 'Freezing'),
        (DATEADD(day, 4, GETDATE()), 30, 'Hot'),
        (DATEADD(day, 5, GETDATE()), 18, 'Mild');
END
GO

