namespace BackendApi.Models.DTOs;

public class CustomerStatisticsDto
{
    public int TotalCustomers { get; set; }
    public int TotalOrders { get; set; }
    public decimal TotalRevenue { get; set; }
    public decimal AverageOrderValue { get; set; }
}

