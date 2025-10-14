using Microsoft.AspNetCore.Mvc;
using BackendApi.Models;
using BackendApi.Data;

namespace BackendApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IProductRepository _repository;
    private readonly ILogger<ProductsController> _logger;

    public ProductsController(
        IProductRepository repository,
        ILogger<ProductsController> logger)
    {
        _repository = repository;
        _logger = logger;
    }

    /// <summary>
    /// Get all products
    /// </summary>
    [HttpGet(Name = "GetProducts")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<IEnumerable<Product>>> GetAll()
    {
        try
        {
            var products = await _repository.GetAllAsync();
            return Ok(products);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving products");
            return StatusCode(500, "An error occurred while retrieving products");
        }
    }

    /// <summary>
    /// Get product by ID
    /// </summary>
    [HttpGet("{id}", Name = "GetProductById")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<Product>> GetById(int id)
    {
        try
        {
            var product = await _repository.GetByIdAsync(id);
            
            if (product == null)
            {
                return NotFound($"Product with ID {id} not found");
            }

            return Ok(product);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving product with ID {Id}", id);
            return StatusCode(500, "An error occurred while retrieving the product");
        }
    }

    /// <summary>
    /// Get products by category
    /// </summary>
    [HttpGet("category/{category}", Name = "GetProductsByCategory")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<IEnumerable<Product>>> GetByCategory(string category)
    {
        try
        {
            var products = await _repository.GetByCategoryAsync(category);
            return Ok(products);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving products in category {Category}", category);
            return StatusCode(500, "An error occurred while retrieving products");
        }
    }

    /// <summary>
    /// Create a new product
    /// </summary>
    [HttpPost(Name = "CreateProduct")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<Product>> Create([FromBody] Product product)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var createdProduct = await _repository.CreateAsync(product);
            return CreatedAtRoute("GetProductById", new { id = createdProduct.Id }, createdProduct);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating product");
            return StatusCode(500, "An error occurred while creating the product");
        }
    }

    /// <summary>
    /// Update an existing product
    /// </summary>
    [HttpPut("{id}", Name = "UpdateProduct")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<Product>> Update(int id, [FromBody] Product product)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var updatedProduct = await _repository.UpdateAsync(id, product);

            if (updatedProduct == null)
            {
                return NotFound($"Product with ID {id} not found");
            }

            return Ok(updatedProduct);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating product with ID {Id}", id);
            return StatusCode(500, "An error occurred while updating the product");
        }
    }

    /// <summary>
    /// Delete a product
    /// </summary>
    [HttpDelete("{id}", Name = "DeleteProduct")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            var deleted = await _repository.DeleteAsync(id);

            if (!deleted)
            {
                return NotFound($"Product with ID {id} not found");
            }

            return NoContent();
        }
        catch (InvalidOperationException ex)
        {
            // Referential integrity violation - product is in orders
            _logger.LogWarning(ex, "Cannot delete product with ID {Id}", id);
            return BadRequest(new { 
                title = "Cannot Delete Product",
                message = ex.Message,
                statusCode = 400
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting product with ID {Id}", id);
            return StatusCode(500, new { 
                title = "Internal Server Error",
                message = "An error occurred while deleting the product",
                statusCode = 500
            });
        }
    }
}

