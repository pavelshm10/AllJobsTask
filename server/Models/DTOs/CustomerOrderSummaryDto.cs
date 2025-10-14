namespace BackendApi.Models.DTOs;

public class CustomerOrderSummaryDto
{
    public int Id { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public int OrderCount { get; set; }
    public decimal TotalSpent { get; set; }
    public DateTime? LastOrderDate { get; set; }
}

