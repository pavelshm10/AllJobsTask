using Microsoft.AspNetCore.Mvc;
using BackendApi.Data;
using BackendApi.Models.DTOs;

namespace BackendApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CustomersController : ControllerBase
{
    private readonly ICustomerRepository _repository;
    private readonly ILogger<CustomersController> _logger;

    public CustomersController(
        ICustomerRepository repository,
        ILogger<CustomersController> logger)
    {
        _repository = repository;
        _logger = logger;
    }

    /// <summary>
    /// Get top customers by order count (default: top 3)
    /// </summary>
    [HttpGet("top")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<IEnumerable<CustomerOrderSummaryDto>>> GetTopCustomers([FromQuery] int count = 3)
    {
        try
        {
            var customers = await _repository.GetTopCustomersByOrderCountAsync(count);
            return Ok(customers);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving top customers");
            return StatusCode(500, "An error occurred while retrieving top customers");
        }
    }

    /// <summary>
    /// Get all customers with their order counts
    /// </summary>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<IEnumerable<CustomerOrderSummaryDto>>> GetAllCustomers()
    {
        try
        {
            var customers = await _repository.GetAllCustomersWithOrderCountAsync();
            return Ok(customers);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving all customers");
            return StatusCode(500, "An error occurred while retrieving customers");
        }
    }

    /// <summary>
    /// Get customer by ID with order information
    /// </summary>
    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<CustomerOrderSummaryDto>> GetCustomerById(int id)
    {
        try
        {
            var customer = await _repository.GetCustomerByIdAsync(id);

            if (customer == null)
            {
                return NotFound($"Customer with ID {id} not found");
            }

            return Ok(customer);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving customer with ID {Id}", id);
            return StatusCode(500, "An error occurred while retrieving the customer");
        }
    }

    /// <summary>
    /// Get customer statistics (total customers, orders, revenue, etc.)
    /// </summary>
    [HttpGet("statistics")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<CustomerStatisticsDto>> GetStatistics()
    {
        try
        {
            var statistics = await _repository.GetCustomerStatisticsAsync();
            return Ok(statistics);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving customer statistics");
            return StatusCode(500, "An error occurred while retrieving statistics");
        }
    }
}

