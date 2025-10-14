namespace BackendApi.Models;

public class Customer
{
    public int Id { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public DateTime CreatedAt { get; set; }
}

