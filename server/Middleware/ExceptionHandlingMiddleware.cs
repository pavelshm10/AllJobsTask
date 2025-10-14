using System.Net;
using System.Text.Json;
using BackendApi.Exceptions;
using BackendApi.Models;

namespace BackendApi.Middleware;

/// <summary>
/// Global exception handling middleware
/// </summary>
public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;
    private readonly IWebHostEnvironment _environment;

    public ExceptionHandlingMiddleware(
        RequestDelegate next,
        ILogger<ExceptionHandlingMiddleware> logger,
        IWebHostEnvironment environment)
    {
        _next = next;
        _logger = logger;
        _environment = environment;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception exception)
        {
            await HandleExceptionAsync(context, exception);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        var errorResponse = CreateErrorResponse(context, exception);
        
        // Log the error with appropriate level
        LogError(exception, context, errorResponse);

        // Set response
        context.Response.ContentType = "application/json";
        context.Response.StatusCode = errorResponse.StatusCode;

        var options = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };

        var json = JsonSerializer.Serialize(errorResponse, options);
        await context.Response.WriteAsync(json);
    }

    private ErrorResponse CreateErrorResponse(HttpContext context, Exception exception)
    {
        var errorResponse = new ErrorResponse
        {
            Path = context.Request.Path,
            Timestamp = DateTime.UtcNow
        };

        switch (exception)
        {
            case AppException appException:
                errorResponse.StatusCode = appException.StatusCode;
                errorResponse.ErrorCode = appException.ErrorCode;
                errorResponse.Message = appException.Message;
                
                if (appException is ValidationException validationException && validationException.Errors != null)
                {
                    errorResponse.ValidationErrors = validationException.Errors;
                }
                break;

            case UnauthorizedAccessException:
                errorResponse.StatusCode = (int)HttpStatusCode.Unauthorized;
                errorResponse.ErrorCode = "UNAUTHORIZED";
                errorResponse.Message = "You are not authorized to access this resource.";
                break;

            default:
                errorResponse.StatusCode = (int)HttpStatusCode.InternalServerError;
                errorResponse.ErrorCode = "INTERNAL_SERVER_ERROR";
                errorResponse.Message = "An unexpected error occurred. Please try again later.";
                break;
        }

        // Include detailed error information only in development
        if (_environment.IsDevelopment())
        {
            errorResponse.Details = exception.ToString();
        }

        return errorResponse;
    }

    private void LogError(Exception exception, HttpContext context, ErrorResponse errorResponse)
    {
        var logMessage = $"Error occurred: {exception.Message} | Path: {context.Request.Path} | Method: {context.Request.Method}";

        switch (errorResponse.StatusCode)
        {
            case >= 500:
                _logger.LogError(exception, "{LogMessage}", logMessage);
                break;
            case >= 400:
                _logger.LogWarning(exception, "{LogMessage}", logMessage);
                break;
            default:
                _logger.LogInformation(exception, "{LogMessage}", logMessage);
                break;
        }

        // Log additional context
        _logger.LogDebug("Request Headers: {@Headers}", context.Request.Headers);
        _logger.LogDebug("Error Response: {@ErrorResponse}", errorResponse);
    }
}

