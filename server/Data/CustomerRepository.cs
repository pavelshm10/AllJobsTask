using BackendApi.Models.DTOs;
using Microsoft.Data.SqlClient;
using System.Data;

namespace BackendApi.Data;

public class CustomerRepository : ICustomerRepository
{
    private readonly string _connectionString;
    private readonly ILogger<CustomerRepository> _logger;

    public CustomerRepository(IConfiguration configuration, ILogger<CustomerRepository> logger)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection") 
            ?? throw new ArgumentNullException("Connection string 'DefaultConnection' not found.");
        _logger = logger;
    }

    public async Task<IEnumerable<CustomerOrderSummaryDto>> GetTopCustomersByOrderCountAsync(int topCount = 3)
    {
        var customers = new List<CustomerOrderSummaryDto>();

        try
        {
            using var connection = new SqlConnection(_connectionString);
            using var command = new SqlCommand("sp_GetTopCustomersByOrderCount", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            command.Parameters.AddWithValue("@TopCount", topCount);

            await connection.OpenAsync();
            using var reader = await command.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                customers.Add(MapToCustomerOrderSummary(reader));
            }

            _logger.LogInformation("Retrieved top {Count} customers by order count", topCount);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving top customers by order count");
            throw;
        }

        return customers;
    }

    public async Task<IEnumerable<CustomerOrderSummaryDto>> GetAllCustomersWithOrderCountAsync()
    {
        var customers = new List<CustomerOrderSummaryDto>();

        try
        {
            using var connection = new SqlConnection(_connectionString);
            using var command = new SqlCommand("sp_GetAllCustomersWithOrderCount", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            await connection.OpenAsync();
            using var reader = await command.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                customers.Add(MapToCustomerOrderSummary(reader));
            }

            _logger.LogInformation("Retrieved {Count} customers with order counts", customers.Count);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving all customers with order counts");
            throw;
        }

        return customers;
    }

    public async Task<CustomerOrderSummaryDto?> GetCustomerByIdAsync(int customerId)
    {
        CustomerOrderSummaryDto? customer = null;

        try
        {
            using var connection = new SqlConnection(_connectionString);
            using var command = new SqlCommand("sp_GetCustomerById", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            command.Parameters.AddWithValue("@CustomerId", customerId);

            await connection.OpenAsync();
            using var reader = await command.ExecuteReaderAsync();

            if (await reader.ReadAsync())
            {
                customer = MapToCustomerOrderSummary(reader);
            }

            _logger.LogInformation("Retrieved customer with ID: {CustomerId}", customerId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving customer with ID: {CustomerId}", customerId);
            throw;
        }

        return customer;
    }

    public async Task<CustomerStatisticsDto> GetCustomerStatisticsAsync()
    {
        var statistics = new CustomerStatisticsDto();

        try
        {
            using var connection = new SqlConnection(_connectionString);
            using var command = new SqlCommand("sp_GetCustomerStatistics", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            await connection.OpenAsync();
            using var reader = await command.ExecuteReaderAsync();

            if (await reader.ReadAsync())
            {
                statistics = new CustomerStatisticsDto
                {
                    TotalCustomers = reader.GetInt32(reader.GetOrdinal("TotalCustomers")),
                    TotalOrders = reader.GetInt32(reader.GetOrdinal("TotalOrders")),
                    TotalRevenue = reader.GetDecimal(reader.GetOrdinal("TotalRevenue")),
                    AverageOrderValue = reader.GetDecimal(reader.GetOrdinal("AverageOrderValue"))
                };
            }

            _logger.LogInformation("Retrieved customer statistics");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving customer statistics");
            throw;
        }

        return statistics;
    }

    private static CustomerOrderSummaryDto MapToCustomerOrderSummary(SqlDataReader reader)
    {
        return new CustomerOrderSummaryDto
        {
            Id = reader.GetInt32(reader.GetOrdinal("Id")),
            CustomerName = reader.GetString(reader.GetOrdinal("CustomerName")),
            Email = reader.IsDBNull(reader.GetOrdinal("Email")) 
                ? null 
                : reader.GetString(reader.GetOrdinal("Email")),
            Phone = reader.IsDBNull(reader.GetOrdinal("Phone")) 
                ? null 
                : reader.GetString(reader.GetOrdinal("Phone")),
            OrderCount = reader.GetInt32(reader.GetOrdinal("OrderCount")),
            TotalSpent = reader.GetDecimal(reader.GetOrdinal("TotalSpent")),
            LastOrderDate = reader.IsDBNull(reader.GetOrdinal("LastOrderDate")) 
                ? null 
                : reader.GetDateTime(reader.GetOrdinal("LastOrderDate"))
        };
    }
}

