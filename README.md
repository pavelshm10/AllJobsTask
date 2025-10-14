# Online Shop - Full Stack Application

A modern full-stack e-commerce application built with Next.js, .NET 6 Web API, and SQL Server. Features product management, customer analytics, and a beautiful responsive UI.

## 📑 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Frontend Structure](#frontend-structure)
- [Backend Structure](#backend-structure)
- [Application Features](#application-features)
- [Error Handling](#error-handling)
- [Configuration](#configuration)
- [Building for Production](#building-for-production)
- [Troubleshooting](#troubleshooting)
- [Learn More](#learn-more)

---

## Overview

This application demonstrates enterprise-level architecture with a Next.js frontend, .NET 6 backend, and SQL Server database running in Docker. It includes:

- **Product Management**: Create, read, update, and delete products
- **Customer Analytics**: View top customers by order count and spending
- **Search & Filter**: Real-time product search with autocomplete
- **Responsive UI**: Modern design with dark mode support
- **Data Caching**: Smart caching with TanStack Query
- **Form Persistence**: Auto-save form data to prevent data loss

---

## Features

### ✅ Core Features

- **Top 3 Customers Display** - Shows customers with highest order counts, total spent, and last order date
- **Product Management** - Full CRUD operations for products
- **Advanced Search** - Custom-built autocomplete search (no external libraries)
- **Create Product Form** - Comprehensive form with validation and persistence
- **Real-time Filtering** - Client-side filtering for instant results
- **Responsive Design** - Mobile-first design that works on all devices
- **Dark Mode** - Toggle between light and dark themes
- **Error Handling** - Graceful error handling with user-friendly messages
- **Loading States** - Visual feedback during data fetching
- **Data Caching** - Automatic caching and background refetching

### 🎨 UI/UX Features

- Beautiful gradient designs
- Smooth animations and transitions
- Color-coded stock levels
- Hover effects and interactions
- Dismissible success/error banners
- Form auto-save functionality
- Accessibility-friendly components

---

## Technology Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **TanStack Query v5** - Data fetching and caching
- **React Hook Form** - Form state management
- **ESLint** - Code linting

### Backend

- **.NET 6** - Cross-platform framework
- **ASP.NET Core Web API** - RESTful API
- **ADO.NET** - Data access with stored procedures
- **Microsoft.Data.SqlClient** - SQL Server driver
- **Serilog** - Structured logging
- **Swagger/OpenAPI** - API documentation

### Database

- **SQL Server 2022** - Relational database
- **Docker** - Database containerization
- **Stored Procedures** - All queries use stored procedures
- **Foreign Keys** - Referential integrity

### DevOps

- **Docker Compose** - Container orchestration
- **npm** - Frontend package manager
- **NuGet** - Backend package manager

---

## Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
│        Next.js 15 + React 18 + TypeScript + Tailwind        │
│                      (Port: 3000)                            │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP/HTTPS
                         │ CORS Enabled
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                       SERVER LAYER                           │
│               .NET 6 Web API + ADO.NET                      │
│                   (Ports: 5000, 5001)                       │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Controllers Layer                        │  │
│  │  - ProductsController                                │  │
│  │  - CustomersController                               │  │
│  │  - Handles HTTP requests/responses                   │  │
│  └────────────────┬─────────────────────────────────────┘  │
│                   │                                          │
│  ┌────────────────▼─────────────────────────────────────┐  │
│  │           Data Access Layer                          │  │
│  │  - Repository Pattern                                │  │
│  │  - ADO.NET with SqlConnection & SqlCommand          │  │
│  └────────────────┬─────────────────────────────────────┘  │
└───────────────────┼─────────────────────────────────────────┘
                    │ Connection String
                    │ TrustServerCertificate=True
                    ▼
┌─────────────────────────────────────────────────────────────┐
│                     DATABASE LAYER                           │
│          SQL Server 2022 (Docker Container)                  │
│                    (Port: 1433)                              │
│                                                              │
│  Database: WeatherDB                                        │
│  - Tables: Products, Customers, Orders, OrderItems         │
│  - Stored Procedures: 14 total                             │
│  - Foreign Keys: Referential integrity                     │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **User Action** → Next.js Page Component
2. **React Query Hook** → Fetches from API (`https://localhost:5001/api/...`)
3. **ASP.NET Controller** → Validates request
4. **Repository** → Creates SqlConnection
5. **Stored Procedure** → Executes database query
6. **ADO.NET** → Maps SqlDataReader to C# models
7. **Controller** → Returns JSON response
8. **React Query** → Caches and updates UI
9. **React Component** → Displays data

---

## Prerequisites

Ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **.NET 6 SDK** - [Download](https://dotnet.microsoft.com/download/dotnet/6.0)
- **Docker Desktop** - [Download](https://www.docker.com/products/docker-desktop)
- **Git** (optional)

---

## Installation & Setup

### 1. Clone or Download the Project

```bash
cd AllJobsAssigment
```

### 2. Start the Database (Docker)

Start the SQL Server container:

```bash
docker-compose up -d
```

Wait for the database to initialize (about 30 seconds). The initialization scripts will run automatically.

Check status:

```bash
docker-compose ps
docker logs mssql-server
```

### 3. Server Setup

Navigate to the server directory and restore dependencies:

```bash
cd server
dotnet restore
```

### 4. Client Setup

Navigate to the client directory and install dependencies:

```bash
cd client
npm install
```

---

## Running the Application

### Start the Backend Server

```bash
cd server
dotnet run
```

**Or use the helper script:**

```bash
cd server
./run-server.sh
```

The API will be available at:

- HTTP: `http://localhost:5000`
- HTTPS: `https://localhost:5001`
- Swagger UI: `https://localhost:5001/swagger`

### Start the Frontend Client

```bash
cd client
npm run dev
```

The application will be available at: `http://localhost:3000`

### Access Points

- **Frontend**: http://localhost:3000
- **Create Product**: http://localhost:3000/products/create
- **Edit Product**: http://localhost:3000/products/[id]/edit
- **API Swagger**: https://localhost:5001/swagger
- **Database**: localhost:1433 (via DBeaver/TablePlus)

---

## Database Schema

### Tables

#### Products

```sql
- Id (INT, PK, Identity)
- ProductName (NVARCHAR(100))
- Category (NVARCHAR(50))
- Supplier (NVARCHAR(100))
- UnitPrice (DECIMAL(10,2))
- Units (INT)
- CreatedAt, UpdatedAt (DATETIME2)
```

**Sample Records:** 30

#### Customers

```sql
- Id (INT, PK, Identity)
- CustomerName (NVARCHAR(100))
- Email (NVARCHAR(100))
- Phone (NVARCHAR(20))
- CreatedAt (DATETIME2)
```

**Sample Records:** 10

#### Orders

```sql
- Id (INT, PK, Identity)
- CustomerId (INT, FK → Customers)
- OrderDate (DATETIME2)
- TotalAmount (DECIMAL(10,2))
- Status (NVARCHAR(50))
```

**Sample Records:** 55+

#### OrderItems

```sql
- Id (INT, PK, Identity)
- OrderId (INT, FK → Orders)
- ProductId (INT, FK → Products)
- Quantity (INT)
- UnitPrice (DECIMAL(10,2))
```

### Stored Procedures (14 total)

**Products (6 procedures)**

- `sp_GetAllProducts` - Get all products
- `sp_GetProductById` - Get product by ID
- `sp_GetProductsByCategory` - Filter by category
- `sp_InsertProduct` - Create new product
- `sp_UpdateProduct` - Update existing product
- `sp_DeleteProduct` - Delete product

**Customers (4 procedures)**

- `sp_GetTopCustomersByOrderCount` - Get top N customers
- `sp_GetAllCustomersWithOrderCount` - Get all customers with stats
- `sp_GetCustomerById` - Get customer by ID
- `sp_GetCustomerStatistics` - Get customer statistics

**Orders (4 procedures)**

- Various order-related stored procedures

All stored procedures use parameterized queries to prevent SQL injection.

### Database Connection

**Credentials:**

- Host: `localhost`
- Port: `1433`
- User: `sa`
- Password: `YourStrong@Passw0rd`
- Database: `WeatherDB`

**Connection String:**

```
Server=localhost,1433;Database=WeatherDB;User Id=sa;Password=YourStrong@Passw0rd;TrustServerCertificate=True;
```

---

## API Endpoints

### Products API

- **GET** `/api/Products` - Get all products

  ```json
  Response: [{ id, productName, category, supplier, unitPrice, units }]
  ```

- **GET** `/api/Products/{id}` - Get product by ID

  ```json
  Response: { id, productName, category, supplier, unitPrice, units }
  ```

- **GET** `/api/Products/category/{category}` - Get products by category

  ```json
  Response: [{ id, productName, category, supplier, unitPrice, units }]
  ```

- **POST** `/api/Products` - Create new product

  ```json
  Request: { productName, category, supplier, unitPrice, units }
  Response: { id, productName, category, supplier, unitPrice, units }
  ```

- **PUT** `/api/Products/{id}` - Update product

  ```json
  Request: { productName, category, supplier, unitPrice, units }
  Response: { id, productName, category, supplier, unitPrice, units }
  ```

- **DELETE** `/api/Products/{id}` - Delete product
  ```json
  Response: 204 No Content
  ```

### Customers API

- **GET** `/api/Customers/top?count=3` - Get top N customers by order count

  ```json
  Response: [{ id, customerName, email, phone, orderCount, totalSpent, lastOrderDate }]
  ```

- **GET** `/api/Customers` - Get all customers with order counts
- **GET** `/api/Customers/{id}` - Get customer by ID
- **GET** `/api/Customers/statistics` - Get customer statistics

### Error Responses

All endpoints follow consistent error response format:

```json
{
  "message": "User-friendly error message",
  "statusCode": 400,
  "timestamp": "2025-10-14T10:30:00Z"
}
```

---

## Frontend Structure

### Project Structure

```
client/
├── app/                          # Next.js App Router
│   ├── page.tsx                 # Home page (52 lines)
│   ├── layout.tsx               # Root layout
│   ├── globals.css              # Global styles
│   └── products/
│       ├── create/
│       │   └── page.tsx         # Create product page
│       └── [id]/
│           └── edit/
│               └── page.tsx     # Edit product page
├── components/                   # Reusable components
│   ├── TopCustomers.tsx         # Top 3 customers display
│   ├── ProductsTable.tsx        # Products table with search
│   ├── SearchBar.tsx            # Search with autocomplete
│   ├── Pagination.tsx           # Pagination component
│   ├── ProductForm.tsx          # Shared product form
│   ├── TechnologyStack.tsx      # Tech stack display
│   ├── ThemeToggle.tsx          # Dark mode toggle
│   ├── ErrorBoundary.tsx        # Error boundary wrapper
│   ├── ErrorBanner.tsx          # Error message banner
│   ├── SuccessBanner.tsx        # Success message banner
│   ├── ConfirmDialog.tsx        # Confirmation dialog
│   └── Toast.tsx                # Toast notifications
├── hooks/                        # Custom React hooks
│   ├── useProducts.ts           # Fetch all products
│   ├── useTopCustomers.ts       # Fetch top customers
│   ├── useCreateProduct.ts      # Create product mutation
│   ├── useUpdateProduct.ts      # Update product mutation
│   ├── useProductDelete.ts      # Delete product mutation
│   └── useFormPersistence.ts    # Form auto-save
├── context/                      # React context
│   ├── ThemeContext.tsx         # Theme state management
│   └── ToastContext.tsx         # Toast notifications
├── providers/
│   └── QueryProvider.tsx        # TanStack Query setup
├── types/
│   └── index.ts                 # TypeScript interfaces
├── utils/
│   ├── apiErrorHandler.ts       # API error handling
│   ├── csvExport.ts             # CSV export utility
│   └── logger.ts                # Frontend logging
├── config/
│   └── api.ts                   # API configuration
└── package.json
```

### Key Components

#### ErrorBoundary vs ErrorBanner

**ErrorBoundary** - Catches unexpected React crashes

- Wraps app or major sections
- Prevents entire app from crashing
- Shows fallback UI for runtime errors
- Usage: `<ErrorBoundary><App /></ErrorBoundary>`

**ErrorBanner** - Displays expected/handled errors

- Shows user-friendly error messages
- For API errors, validation errors
- Dismissible by user
- Usage: `{error && <ErrorBanner message={error} onDismiss={...} />}`

**Best Practice**: Use both! ErrorBoundary as a safety net, ErrorBanner for expected errors.

### TypeScript Interfaces

```typescript
// Product
export interface Product {
  id: number;
  productName: string;
  category: string;
  supplier: string;
  unitPrice: number;
  units: number;
}

// Customer Order Summary
export interface CustomerOrderSummary {
  id: number;
  customerName: string;
  email: string;
  phone: string;
  orderCount: number;
  totalSpent: number;
  lastOrderDate: string;
}
```

### Data Fetching with TanStack Query

All data fetching uses TanStack Query for:

- Automatic caching (1 minute stale time)
- Background refetching
- Request deduplication
- Loading and error states
- Optimistic updates

Example:

```typescript
const { data: products = [], isLoading, error, refetch } = useProducts();
```

---

## Backend Structure

### Project Structure

```
server/
├── Controllers/
│   ├── ProductsController.cs      # Product endpoints
│   ├── CustomersController.cs     # Customer endpoints
│   └── WeatherForecastController.cs
├── Data/                           # Repository pattern
│   ├── IProductRepository.cs      # Product interface
│   ├── ProductRepository.cs       # Product implementation
│   ├── ICustomerRepository.cs
│   └── CustomerRepository.cs
├── Models/
│   ├── Product.cs                 # Product model
│   ├── Customer.cs                # Customer model
│   ├── Order.cs                   # Order model
│   ├── ErrorResponse.cs           # Error response model
│   └── DTOs/
│       ├── CustomerOrderSummaryDto.cs
│       └── CustomerStatisticsDto.cs
├── Middleware/
│   └── ExceptionHandlingMiddleware.cs  # Global error handling
├── Exceptions/
│   └── CustomExceptions.cs        # Custom exception types
├── Database/                       # SQL scripts
│   ├── 01-InitDatabase.sql
│   ├── 02-StoredProcedures.sql
│   ├── 03-CustomerOrders.sql
│   ├── 04-CustomerStoredProcedures.sql
│   ├── 05-Products.sql
│   ├── 06-ProductStoredProcedures.sql
│   ├── 07-OrderItems.sql
│   └── init-db.sh
├── logs/                           # Application logs
│   └── api-{date}.log
├── Program.cs                      # Application entry point
├── appsettings.json               # Configuration
└── BackendApi.csproj              # Project file
```

### Repository Pattern

```csharp
public interface IProductRepository
{
    Task<IEnumerable<Product>> GetAllProductsAsync();
    Task<Product?> GetProductByIdAsync(int id);
    Task<Product> CreateProductAsync(Product product);
    Task<Product?> UpdateProductAsync(int id, Product product);
    Task<bool> DeleteProductAsync(int id);
}
```

All repositories use ADO.NET with stored procedures for database access.

### Dependency Injection

Services are registered in `Program.cs`:

```csharp
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<ICustomerRepository, CustomerRepository>();
```

### Logging

Uses Serilog for structured logging:

- Console output for development
- File logging with daily rolling
- Log files: `logs/api-{date}.log`

---

## Application Features

### 1. Home Page

**Route:** `/`

**Features:**

- Top 3 customers by order count
- Product table with search and pagination
- Real-time search with autocomplete
- Responsive grid layout
- Dark mode support

### 2. Product Management

**Create Product** (`/products/create`)

- Form with 6 fields (name, category, supplier, quantity, price, units)
- Client and server-side validation
- Form persistence with localStorage
- Success/error handling with dismissible banners
- Auto-clear form on success

**Edit Product** (`/products/[id]/edit`)

- Pre-populated form with existing data
- Same validation as create
- Update confirmation
- Delete functionality with confirmation dialog

### 3. Search & Autocomplete

**Custom-built** (no external autocomplete library):

- Filters by product name OR category
- Real-time suggestions dropdown
- Result counter
- Clear button
- Client-side filtering (instant results)
- Keyboard navigation support

### 4. Top Customers Display

Shows top 3 customers with:

- Customer name and contact info
- Total order count
- Total amount spent
- Last order date
- Rank badges (#1, #2, #3)
- Refresh button

### 5. Dark Mode

- Toggle between light and dark themes
- Persists theme preference
- Smooth transitions
- Accessible color contrast

### 6. Form Persistence

Automatically saves form data to localStorage:

- Saves on every input change
- Restores data on page reload
- Clears on successful submission
- Prevents data loss from accidental navigation

---

## Error Handling

### Frontend Error Handling

1. **ErrorBoundary Component**

   - Catches React component errors
   - Shows fallback UI
   - Logs errors to console (development)

2. **API Error Handling**

   - User-friendly error messages
   - No technical details exposed
   - Dismissible error banners

3. **Form Validation**
   - Real-time validation
   - Inline error messages
   - Prevents invalid submissions

### Backend Error Handling

1. **Global Exception Middleware**

   - Catches all unhandled exceptions
   - Returns consistent error format
   - Logs errors with Serilog

2. **Custom Exceptions**

   - `NotFoundException` - 404 errors
   - `ValidationException` - 400 errors
   - `DatabaseException` - 500 errors

3. **Error Response Format**
   ```json
   {
     "message": "Product not found",
     "statusCode": 404,
     "timestamp": "2025-10-14T10:30:00Z"
   }
   ```

---

## Configuration

### Frontend Configuration

**API URL** (`client/config/api.ts`):

```typescript
export const API_URL = "https://localhost:5001/api";
```

**TanStack Query Settings** (`client/providers/QueryProvider.tsx`):

```typescript
{
  staleTime: 60000,  // 1 minute
  refetchOnWindowFocus: false,
  retry: 1
}
```

### Backend Configuration

**Connection String** (`server/appsettings.json`):

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost,1433;Database=WeatherDB;User Id=sa;Password=YourStrong@Passw0rd;TrustServerCertificate=True;"
  }
}
```

**CORS Configuration** (`server/Program.cs`):

```csharp
policy.WithOrigins("http://localhost:3000", "http://localhost:3001")
      .AllowAnyHeader()
      .AllowAnyMethod();
```

**Logging Configuration** (`server/Program.cs`):

```csharp
Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Information()
    .WriteTo.Console()
    .WriteTo.File("logs/api-.log", rollingInterval: RollingInterval.Day)
    .CreateLogger();
```

---

## Building for Production

### Frontend Build

```bash
cd client
npm run build
npm start
```

The optimized production build will be created in `.next/` directory.

### Backend Build

```bash
cd server
dotnet publish -c Release -o ./publish
```

The published files will be in `server/publish/` directory.

### Docker Production Setup

For production deployment, update `docker-compose.yml` to include the application containers and use environment variables for sensitive data.

---

## Troubleshooting

### Docker & Database Issues

**Container Not Starting:**

```bash
docker ps                          # Check running containers
docker logs mssql-server          # Check container logs
docker-compose down               # Stop containers
docker-compose up -d              # Restart containers
```

**Database Connection Errors:**

```bash
# Verify SQL Server is healthy
docker exec -it mssql-server /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P 'YourStrong@Passw0rd' -Q "SELECT @@VERSION"

# Check database exists
docker exec -it mssql-server /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P 'YourStrong@Passw0rd' -Q "SELECT name FROM sys.databases"
```

**Port 1433 Already in Use:**

```bash
# Find process using port
lsof -ti:1433

# Or change port in docker-compose.yml
ports:
  - "1434:1433"  # Use 1434 on host
```

### Backend Issues

**Certificate Errors (HTTPS):**

```bash
dotnet dev-certs https --trust
```

**Port Already in Use:**
Edit `server/Properties/launchSettings.json` to change ports.

**Database Connection String:**
Update connection string in `server/appsettings.json` if you changed SQL Server port or password.

### Frontend Issues

**Cannot Connect to API:**

- Ensure backend is running on `https://localhost:5001`
- Check CORS configuration in `server/Program.cs`
- Verify API URL in `client/config/api.ts`

**Module Not Found:**

```bash
cd client
rm -rf node_modules package-lock.json
npm install
```

**Build Errors:**

```bash
cd client
npm run build
# Fix any TypeScript errors shown
```

---

## Learn More

### Frontend Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [React Hook Form Documentation](https://react-hook-form.com)

### Backend Resources

- [.NET 6 Documentation](https://docs.microsoft.com/en-us/dotnet/)
- [ASP.NET Core Documentation](https://docs.microsoft.com/en-us/aspnet/core/)
- [ADO.NET Documentation](https://docs.microsoft.com/en-us/dotnet/framework/data/adonet/)
- [Serilog Documentation](https://serilog.net/)

### Database Resources

- [SQL Server Documentation](https://docs.microsoft.com/en-us/sql/sql-server/)
- [T-SQL Reference](https://docs.microsoft.com/en-us/sql/t-sql/)
- [Docker Documentation](https://docs.docker.com/)

---

## Architecture Patterns

### Frontend Patterns

- ✅ Component-Based Architecture
- ✅ Custom Hooks Pattern
- ✅ Context API for State
- ✅ Props Down, Events Up
- ✅ Server/Client Components
- ✅ Repository Pattern (API layer)

### Backend Patterns

- ✅ Repository Pattern
- ✅ Dependency Injection
- ✅ Interface Segregation
- ✅ DTO Pattern
- ✅ Middleware Pipeline
- ✅ RESTful API Design

### Database Patterns

- ✅ Stored Procedures Only
- ✅ Parameterized Queries
- ✅ Foreign Key Constraints
- ✅ Normalized Schema
- ✅ Computed Columns

---

## Security Features

### SQL Injection Prevention

- All queries use parameterized stored procedures
- No dynamic SQL
- ADO.NET SqlParameters

### CORS Configuration

- Specific origins allowed (not wildcard)
- Configured for development environments

### Input Validation

- Client-side validation (React Hook Form)
- Server-side validation (ModelState)
- Type safety (TypeScript)

### Error Handling

- Generic error messages to users
- Detailed logs for developers
- No stack traces in production

### HTTPS Enforcement

- HTTPS redirection enabled
- Development certificates trusted

---

## Performance Optimizations

### Frontend

- TanStack Query caching (reduces API calls)
- Request deduplication
- Client-side filtering (instant search)
- Code splitting (component-based)
- Image optimization (Next.js)

### Backend

- Stored procedures (compiled by SQL Server)
- Connection pooling (ADO.NET default)
- Async/await throughout
- Efficient queries (indexed PKs)

### Database

- Indexed primary keys
- Computed columns (no storage overhead)
- Efficient stored procedures
- Docker volumes for persistence

---

## Code Quality

### Metrics

- **TypeScript Coverage:** 100%
- **Linting Errors:** 0
- **Component Average Size:** ~110 lines
- **Main Page Size:** 52 lines (was 684!)

### Best Practices

- ✅ Single Responsibility Principle
- ✅ DRY (Don't Repeat Yourself)
- ✅ Type Safety Throughout
- ✅ Error Handling Everywhere
- ✅ Consistent Naming Conventions
- ✅ Proper File Organization
- ✅ Clear Component Boundaries

---

## Project Statistics

- **Total Tables:** 4
- **Total Stored Procedures:** 14
- **Total API Endpoints:** 15+
- **Frontend Components:** 15+
- **Custom Hooks:** 6
- **Total Pages:** 3
- **Sample Data:** 100+ records

---

## License

This project is open source and available for educational purposes.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**Happy Coding! 🚀**
