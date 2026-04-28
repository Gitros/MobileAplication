using MediatR;
using Microsoft.AspNetCore.Mvc;
using SolutionOrdersMobile.Application.Features.Brands.Commands;
using SolutionOrdersMobile.Application.Features.Brands.DTOs;
using SolutionOrdersMobile.Application.Features.Brands.Queries;

namespace SolutionOrdersMobile.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BrandsController : ControllerBase
{
    private readonly IMediator _mediator;
    public BrandsController(IMediator mediator) => _mediator = mediator;

    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        Ok(await _mediator.Send(new GetAllBrandsQuery()));

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id) =>
        Ok(await _mediator.Send(new GetBrandByIdQuery(id)));

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateBrandDto dto)
    {
        var id = await _mediator.Send(new CreateBrandCommand(dto.Name, dto.Description, dto.LogoUrl));
        return CreatedAtAction(nameof(GetById), new { id }, new { id });
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateBrandDto dto)
    {
        await _mediator.Send(new UpdateBrandCommand(id, dto.Name, dto.Description, dto.LogoUrl));
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _mediator.Send(new DeleteBrandCommand(id));
        return NoContent();
    }
}
