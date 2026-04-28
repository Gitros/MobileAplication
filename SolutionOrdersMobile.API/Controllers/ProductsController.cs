using MediatR;
using Microsoft.AspNetCore.Mvc;
using SolutionOrdersMobile.Application.Features.Products.Commands;
using SolutionOrdersMobile.Application.Features.Products.DTOs;
using SolutionOrdersMobile.Application.Features.Products.Queries;

namespace SolutionOrdersMobile.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IMediator _mediator;
    public ProductsController(IMediator mediator) => _mediator = mediator;

    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        Ok(await _mediator.Send(new GetAllProductsQuery()));

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id) =>
        Ok(await _mediator.Send(new GetProductByIdQuery(id)));

    [HttpGet("category/{categoryId:int}")]
    public async Task<IActionResult> GetByCategory(int categoryId) =>
        Ok(await _mediator.Send(new GetProductsByCategoryQuery(categoryId)));

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateProductDto dto)
    {
        var id = await _mediator.Send(new CreateProductCommand(
            dto.Name, dto.Description, dto.Price, dto.StockQuantity,
            dto.WeightGrams, dto.ImageUrl, dto.BrandId, dto.CategoryId, dto.TagIds));
        return CreatedAtAction(nameof(GetById), new { id }, new { id });
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateProductDto dto)
    {
        await _mediator.Send(new UpdateProductCommand(
            id, dto.Name, dto.Description, dto.Price, dto.StockQuantity,
            dto.WeightGrams, dto.ImageUrl, dto.IsActive, dto.BrandId, dto.CategoryId, dto.TagIds));
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _mediator.Send(new DeleteProductCommand(id));
        return NoContent();
    }
}
