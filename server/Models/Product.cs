namespace BackendApi.Models;

public class Product
{
    public int Id { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Supplier { get; set; } = string.Empty;
    public decimal UnitPrice { get; set; }
    public int Units { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

