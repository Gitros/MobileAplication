using MediatR;
using Microsoft.AspNetCore.Mvc;
using SolutionOrdersMobile.Application.Features.Addresses.Commands;
using SolutionOrdersMobile.Application.Features.Addresses.DTOs;
using SolutionOrdersMobile.Application.Features.Addresses.Queries;

namespace SolutionOrdersMobile.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AddressesController : ControllerBase
{
    private readonly IMediator _mediator;
    public AddressesController(IMediator mediator) => _mediator = mediator;

    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        Ok(await _mediator.Send(new GetAllAddressesQuery()));

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id) =>
        Ok(await _mediator.Send(new GetAddressByIdQuery(id)));

    [HttpGet("customer/{customerId:int}")]
    public async Task<IActionResult> GetByCustomer(int customerId) =>
        Ok(await _mediator.Send(new GetAddressesByCustomerQuery(customerId)));

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateAddressDto dto)
    {
        var id = await _mediator.Send(new CreateAddressCommand(
            dto.Street, dto.City, dto.PostalCode, dto.Country, dto.IsDefault, dto.CustomerId));
        return CreatedAtAction(nameof(GetById), new { id }, new { id });
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateAddressDto dto)
    {
        await _mediator.Send(new UpdateAddressCommand(id, dto.Street, dto.City, dto.PostalCode, dto.Country, dto.IsDefault));
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _mediator.Send(new DeleteAddressCommand(id));
        return NoContent();
    }
}
