using MediatR;
using Microsoft.AspNetCore.Mvc;
using SolutionOrdersMobile.Application.Features.Tags.Commands;
using SolutionOrdersMobile.Application.Features.Tags.DTOs;
using SolutionOrdersMobile.Application.Features.Tags.Queries;

namespace SolutionOrdersMobile.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TagsController : ControllerBase
{
    private readonly IMediator _mediator;
    public TagsController(IMediator mediator) => _mediator = mediator;

    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        Ok(await _mediator.Send(new GetAllTagsQuery()));

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id) =>
        Ok(await _mediator.Send(new GetTagByIdQuery(id)));

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateTagDto dto)
    {
        var id = await _mediator.Send(new CreateTagCommand(dto.Name));
        return CreatedAtAction(nameof(GetById), new { id }, new { id });
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateTagDto dto)
    {
        await _mediator.Send(new UpdateTagCommand(id, dto.Name));
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _mediator.Send(new DeleteTagCommand(id));
        return NoContent();
    }
}
