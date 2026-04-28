using MediatR;
using Microsoft.AspNetCore.Mvc;
using SolutionOrdersMobile.Application.Features.Reviews.Commands;
using SolutionOrdersMobile.Application.Features.Reviews.DTOs;
using SolutionOrdersMobile.Application.Features.Reviews.Queries;

namespace SolutionOrdersMobile.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReviewsController : ControllerBase
{
    private readonly IMediator _mediator;
    public ReviewsController(IMediator mediator) => _mediator = mediator;

    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        Ok(await _mediator.Send(new GetAllReviewsQuery()));

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id) =>
        Ok(await _mediator.Send(new GetReviewByIdQuery(id)));

    [HttpGet("product/{productId:int}")]
    public async Task<IActionResult> GetByProduct(int productId) =>
        Ok(await _mediator.Send(new GetReviewsByProductQuery(productId)));

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateReviewDto dto)
    {
        var id = await _mediator.Send(new CreateReviewCommand(dto.Rating, dto.Comment, dto.CustomerId, dto.ProductId));
        return CreatedAtAction(nameof(GetById), new { id }, new { id });
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateReviewDto dto)
    {
        await _mediator.Send(new UpdateReviewCommand(id, dto.Rating, dto.Comment));
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _mediator.Send(new DeleteReviewCommand(id));
        return NoContent();
    }
}
