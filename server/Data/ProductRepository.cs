using BackendApi.Models;
using BackendApi.Exceptions;
using Microsoft.Data.SqlClient;
using System.Data;

namespace BackendApi.Data;

public class ProductRepository : IProductRepository
{
    private readonly string _connectionString;
    private readonly ILogger<ProductRepository> _logger;

    public ProductRepository(IConfiguration configuration, ILogger<ProductRepository> logger)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection") 
            ?? throw new ArgumentNullException("Connection string 'DefaultConnection' not found.");
        _logger = logger;
    }

    public async Task<IEnumerable<Product>> GetAllAsync()
    {
        var products = new List<Product>();

        try
        {
            using var connection = new SqlConnection(_connectionString);
            using var command = new SqlCommand("sp_GetAllProducts", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            await connection.OpenAsync();
            using var reader = await command.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                products.Add(MapToProduct(reader));
            }

            _logger.LogInformation("Retrieved {Count} products", products.Count);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving all products");
            throw;
        }

        return products;
    }

    public async Task<Product?> GetByIdAsync(int id)
    {
        Product? product = null;

        try
        {
            using var connection = new SqlConnection(_connectionString);
            using var command = new SqlCommand("sp_GetProductById", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            command.Parameters.AddWithValue("@Id", id);

            await connection.OpenAsync();
            using var reader = await command.ExecuteReaderAsync();

            if (await reader.ReadAsync())
            {
                product = MapToProduct(reader);
            }

            _logger.LogInformation("Retrieved product with ID: {Id}", id);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving product with ID: {Id}", id);
            throw;
        }

        return product;
    }

    public async Task<IEnumerable<Product>> GetByCategoryAsync(string category)
    {
        var products = new List<Product>();

        try
        {
            using var connection = new SqlConnection(_connectionString);
            using var command = new SqlCommand("sp_GetProductsByCategory", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            command.Parameters.AddWithValue("@Category", category);

            await connection.OpenAsync();
            using var reader = await command.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                products.Add(MapToProduct(reader));
            }

            _logger.LogInformation("Retrieved {Count} products in category: {Category}", products.Count, category);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving products in category: {Category}", category);
            throw;
        }

        return products;
    }

    public async Task<Product> CreateAsync(Product product)
    {
        Product? createdProduct = null;

        try
        {
            using var connection = new SqlConnection(_connectionString);
            using var command = new SqlCommand("sp_InsertProduct", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            command.Parameters.AddWithValue("@ProductName", product.ProductName);
            command.Parameters.AddWithValue("@Category", product.Category);
            command.Parameters.AddWithValue("@Supplier", product.Supplier);
            command.Parameters.AddWithValue("@UnitPrice", product.UnitPrice);
            command.Parameters.AddWithValue("@Units", product.Units);

            await connection.OpenAsync();
            using var reader = await command.ExecuteReaderAsync();

            if (await reader.ReadAsync())
            {
                createdProduct = MapToProduct(reader);
            }

            _logger.LogInformation("Created product with ID: {Id}", createdProduct?.Id);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating product");
            throw;
        }

        return createdProduct ?? throw new InvalidOperationException("Failed to create product");
    }

    public async Task<Product?> UpdateAsync(int id, Product product)
    {
        Product? updatedProduct = null;

        try
        {
            using var connection = new SqlConnection(_connectionString);
            using var command = new SqlCommand("sp_UpdateProduct", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            command.Parameters.AddWithValue("@Id", id);
            command.Parameters.AddWithValue("@ProductName", product.ProductName);
            command.Parameters.AddWithValue("@Category", product.Category);
            command.Parameters.AddWithValue("@Supplier", product.Supplier);
            command.Parameters.AddWithValue("@UnitPrice", product.UnitPrice);
            command.Parameters.AddWithValue("@Units", product.Units);

            await connection.OpenAsync();
            using var reader = await command.ExecuteReaderAsync();

            if (await reader.ReadAsync())
            {
                updatedProduct = MapToProduct(reader);
            }

            _logger.LogInformation("Updated product with ID: {Id}", id);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating product with ID: {Id}", id);
            throw;
        }

        return updatedProduct;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        try
        {
            using var connection = new SqlConnection(_connectionString);
            using var command = new SqlCommand("sp_DeleteProduct", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            command.Parameters.AddWithValue("@Id", id);

            await connection.OpenAsync();
            var result = await command.ExecuteScalarAsync();

            var rowsAffected = Convert.ToInt32(result);
            
            if (rowsAffected == 0)
            {
                _logger.LogWarning("Product with ID {Id} not found for deletion", id);
                return false;
            }
            
            _logger.LogInformation("Successfully deleted product with ID: {Id}", id);
            return true;
        }
        catch (SqlException sqlEx) when (sqlEx.Number == 50001)
        {
            // Referential integrity violation - product is in orders
            _logger.LogWarning("Referential integrity violation for product ID {Id}: {Message}", id, sqlEx.Message);
            throw new ReferentialIntegrityException(sqlEx.Message);
        }
        catch (SqlException sqlEx)
        {
            _logger.LogError(sqlEx, "SQL error deleting product with ID: {Id}. Error Number: {ErrorNumber}", id, sqlEx.Number);
            throw new DatabaseException($"Database error occurred while deleting product with ID {id}.", sqlEx);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error deleting product with ID: {Id}", id);
            throw new DatabaseException($"An unexpected error occurred while deleting product with ID {id}.", ex);
        }
    }

    private static Product MapToProduct(SqlDataReader reader)
    {
        return new Product
        {
            Id = reader.GetInt32(reader.GetOrdinal("Id")),
            ProductName = reader.GetString(reader.GetOrdinal("ProductName")),
            Category = reader.GetString(reader.GetOrdinal("Category")),
            Supplier = reader.GetString(reader.GetOrdinal("Supplier")),
            UnitPrice = reader.GetDecimal(reader.GetOrdinal("UnitPrice")),
            Units = reader.GetInt32(reader.GetOrdinal("Units")),
            CreatedAt = reader.GetDateTime(reader.GetOrdinal("CreatedAt")),
            UpdatedAt = reader.GetDateTime(reader.GetOrdinal("UpdatedAt"))
        };
    }
}

