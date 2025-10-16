# Online Shop - Full Stack Application

A modern e-commerce application built with **.NET 6 Web API** backend and **Next.js 15** frontend, featuring a SQL Server database with comprehensive CRUD operations for products and customer analytics.

## 🏗️ Architecture Overview

- **Backend**: .NET 6 Web API with ADO.NET and Stored Procedures
- **Frontend**: Next.js 15 with React 19, TypeScript, and Tailwind CSS
- **Database**: Microsoft SQL Server 2022 with Docker
- **State Management**: TanStack React Query for server state
- **UI**: Responsive design with dark/light theme support

## 📋 Prerequisites

- **Docker & Docker Compose** (for database)
- **.NET 6 SDK** (for backend)
- **Node.js 18+** (for frontend)
- **npm** or **yarn**

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/pavelshm10/AllJobsTask.git
cd AllJobsTask
```

### 2. Start the Database

```bash
# Start SQL Server using Docker Compose
docker-compose up -d mssql

# Wait for the database to be ready (about 30-60 seconds)
# Check if the container is healthy
docker-compose ps
```

### 3. Run the Backend (.NET 6 API)

```bash
cd server

# Restore dependencies and run
dotnet restore
dotnet run

# Or use the provided script (macOS/Linux)
chmod +x run-server.sh
./run-server.sh
```

The API will be available at:

- **HTTPS**: https://localhost:5001
- **HTTP**: http://localhost:5000
- **Swagger UI**: https://localhost:5001/swagger

### 4. Run the Frontend (Next.js)

```bash
cd client

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at: http://localhost:3000

## 🛠️ Development Setup

### Database Configuration

The application uses SQL Server with the following default connection:

- **Server**: localhost:1433
- **Database**: WeatherDB (legacy name, contains e-commerce data)
- **Username**: sa
- **Password**: YourStrong@Passw0rd

### Backend Configuration

The backend is configured with:

- **CORS**: Enabled for frontend origins (localhost:3000-3002)
- **Logging**: Serilog with file and console output
- **Exception Handling**: Global middleware for error handling
- **Swagger**: API documentation in development mode

### Frontend Configuration

The frontend uses:

- **React Query**: For server state management and caching
- **Tailwind CSS**: For styling with dark/light theme support
- **TypeScript**: For type safety
- **React Hook Form**: For form handling

## 📊 Database Schema

The application includes the following main entities:

### Products Table

- `Id` (Primary Key)
- `ProductName` (NVARCHAR)
- `Category` (NVARCHAR)
- `Supplier` (NVARCHAR)
- `UnitPrice` (DECIMAL)
- `Units` (INT)
- `CreatedAt`, `UpdatedAt` (DATETIME2)

### Customers Table

- `Id` (Primary Key)
- `CustomerName` (NVARCHAR)
- `Email` (NVARCHAR)
- `Phone` (NVARCHAR)
- `CreatedAt` (DATETIME2)

### Orders Table

- `Id` (Primary Key)
- `CustomerId` (Foreign Key)
- `OrderDate` (DATETIME2)
- `TotalAmount` (DECIMAL)
- `Status` (NVARCHAR)

## 🔧 API Endpoints

### Products

- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get product by ID
- `POST /api/products` - Create new product
- `PUT /api/products/{id}` - Update product
- `DELETE /api/products/{id}` - Delete product

### Customers

- `GET /api/customers/top/{count}` - Get top customers by order count
- `GET /api/customers/{id}/statistics` - Get customer statistics

