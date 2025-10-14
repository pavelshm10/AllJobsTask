namespace BackendApi.Exceptions;

/// <summary>
/// Base exception class for all custom application exceptions
/// </summary>
public abstract class AppException : Exception
{
    public int StatusCode { get; }
    public string? ErrorCode { get; }
    
    protected AppException(string message, int statusCode, string? errorCode = null) 
        : base(message)
    {
        StatusCode = statusCode;
        ErrorCode = errorCode;
    }
    
    protected AppException(string message, Exception innerException, int statusCode, string? errorCode = null) 
        : base(message, innerException)
    {
        StatusCode = statusCode;
        ErrorCode = errorCode;
    }
}

/// <summary>
/// Exception for resource not found scenarios (404)
/// </summary>
public class NotFoundException : AppException
{
    public NotFoundException(string resourceName, object key)
        : base($"{resourceName} with ID '{key}' was not found.", 404, "RESOURCE_NOT_FOUND")
    {
    }
    
    public NotFoundException(string message)
        : base(message, 404, "RESOURCE_NOT_FOUND")
    {
    }
}

/// <summary>
/// Exception for business rule violations (400)
/// </summary>
public class BusinessRuleException : AppException
{
    public BusinessRuleException(string message, string? errorCode = null)
        : base(message, 400, errorCode ?? "BUSINESS_RULE_VIOLATION")
    {
    }
}

/// <summary>
/// Exception for validation errors (400)
/// </summary>
public class ValidationException : AppException
{
    public IDictionary<string, string[]>? Errors { get; }
    
    public ValidationException(string message)
        : base(message, 400, "VALIDATION_ERROR")
    {
    }
    
    public ValidationException(IDictionary<string, string[]> errors)
        : base("One or more validation errors occurred.", 400, "VALIDATION_ERROR")
    {
        Errors = errors;
    }
}

/// <summary>
/// Exception for database-related errors (500)
/// </summary>
public class DatabaseException : AppException
{
    public DatabaseException(string message, Exception innerException)
        : base(message, innerException, 500, "DATABASE_ERROR")
    {
    }
}

/// <summary>
/// Exception for referential integrity violations (409)
/// </summary>
public class ReferentialIntegrityException : AppException
{
    public ReferentialIntegrityException(string message)
        : base(message, 409, "REFERENTIAL_INTEGRITY_VIOLATION")
    {
    }
}

