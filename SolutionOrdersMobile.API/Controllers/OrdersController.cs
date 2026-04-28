using MediatR;
using Microsoft.AspNetCore.Mvc;
using SolutionOrdersMobile.Application.Features.Orders.Commands;
using SolutionOrdersMobile.Application.Features.Orders.DTOs;
using SolutionOrdersMobile.Application.Features.Orders.Queries;

namespace SolutionOrdersMobile.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly IMediator _mediator;
    public OrdersController(IMediator mediator) => _mediator = mediator;

    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        Ok(await _mediator.Send(new GetAllOrdersQuery()));

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id) =>
        Ok(await _mediator.Send(new GetOrderByIdQuery(id)));

    [HttpGet("customer/{customerId:int}")]
    public async Task<IActionResult> GetByCustomer(int customerId) =>
        Ok(await _mediator.Send(new GetOrdersByCustomerQuery(customerId)));

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateOrderDto dto)
    {
        var items = dto.Items.Select(i => new CreateOrderItemRequest(i.ProductId, i.Quantity)).ToList();
        var id = await _mediator.Send(new CreateOrderCommand(dto.Notes, dto.CustomerId, dto.ShippingAddressId, items));
        return CreatedAtAction(nameof(GetById), new { id }, new { id });
    }

    [HttpPatch("{id:int}/status")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateOrderStatusDto dto)
    {
        await _mediator.Send(new UpdateOrderStatusCommand(id, dto.Status));
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _mediator.Send(new DeleteOrderCommand(id));
        return NoContent();
    }
}
