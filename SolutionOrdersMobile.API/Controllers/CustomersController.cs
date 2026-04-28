using MediatR;
using Microsoft.AspNetCore.Mvc;
using SolutionOrdersMobile.Application.Features.Customers.Commands;
using SolutionOrdersMobile.Application.Features.Customers.DTOs;
using SolutionOrdersMobile.Application.Features.Customers.Queries;

namespace SolutionOrdersMobile.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CustomersController : ControllerBase
{
    private readonly IMediator _mediator;
    public CustomersController(IMediator mediator) => _mediator = mediator;

    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        Ok(await _mediator.Send(new GetAllCustomersQuery()));

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id) =>
        Ok(await _mediator.Send(new GetCustomerByIdQuery(id)));

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateCustomerDto dto)
    {
        var id = await _mediator.Send(new CreateCustomerCommand(dto.FirstName, dto.LastName, dto.Email, dto.Phone));
        return CreatedAtAction(nameof(GetById), new { id }, new { id });
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateCustomerDto dto)
    {
        await _mediator.Send(new UpdateCustomerCommand(id, dto.FirstName, dto.LastName, dto.Email, dto.Phone));
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _mediator.Send(new DeleteCustomerCommand(id));
        return NoContent();
    }
}
