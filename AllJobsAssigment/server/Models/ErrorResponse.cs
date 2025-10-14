namespace BackendApi.Models;

/// <summary>
/// Standardized error response model
/// </summary>
public class ErrorResponse
{
    /// <summary>
    /// HTTP status code
    /// </summary>
    public int StatusCode { get; set; }
    
    /// <summary>
    /// Error code for client-side handling
    /// </summary>
    public string? ErrorCode { get; set; }
    
    /// <summary>
    /// User-friendly error message
    /// </summary>
    public string Message { get; set; } = string.Empty;
    
    /// <summary>
    /// Detailed error information (only in development)
    /// </summary>
    public string? Details { get; set; }
    
    /// <summary>
    /// Timestamp of when the error occurred
    /// </summary>
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    
    /// <summary>
    /// Request path that caused the error
    /// </summary>
    public string? Path { get; set; }
    
    /// <summary>
    /// Validation errors (if applicable)
    /// </summary>
    public IDictionary<string, string[]>? ValidationErrors { get; set; }
}

