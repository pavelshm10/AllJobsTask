using BackendApi.Models.DTOs;

namespace BackendApi.Data;

public interface ICustomerRepository
{
    Task<IEnumerable<CustomerOrderSummaryDto>> GetTopCustomersByOrderCountAsync(int topCount = 3);
    Task<IEnumerable<CustomerOrderSummaryDto>> GetAllCustomersWithOrderCountAsync();
    Task<CustomerOrderSummaryDto?> GetCustomerByIdAsync(int customerId);
    Task<CustomerStatisticsDto> GetCustomerStatisticsAsync();
}

