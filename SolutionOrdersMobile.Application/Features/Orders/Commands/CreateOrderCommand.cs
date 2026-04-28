using FluentValidation;
using MediatR;
using SolutionOrdersMobile.Domain.Entities;
using SolutionOrdersMobile.Domain.Enums;
using SolutionOrdersMobile.Domain.Interfaces.Repositories;

namespace SolutionOrdersMobile.Application.Features.Orders.Commands;

public record CreateOrderItemRequest(int ProductId, int Quantity);
public record CreateOrderCommand(string? Notes, int CustomerId, int ShippingAddressId, List<CreateOrderItemRequest> Items) : IRequest<int>;

public class CreateOrderCommandValidator : AbstractValidator<CreateOrderCommand>
{
    public CreateOrderCommandValidator()
    {
        RuleFor(x => x.CustomerId).GreaterThan(0);
        RuleFor(x => x.ShippingAddressId).GreaterThan(0);
        RuleFor(x => x.Items).NotEmpty();
        RuleForEach(x => x.Items).ChildRules(item =>
        {
            item.RuleFor(i => i.ProductId).GreaterThan(0);
            item.RuleFor(i => i.Quantity).GreaterThan(0);
        });
    }
}

public class CreateOrderCommandHandler : IRequestHandler<CreateOrderCommand, int>
{
    private readonly IUnitOfWork _uow;
    public CreateOrderCommandHandler(IUnitOfWork uow) => _uow = uow;

    public async Task<int> Handle(CreateOrderCommand request, CancellationToken cancellationToken)
    {
        var orderItems = new List<OrderItem>();
        decimal total = 0;

        foreach (var item in request.Items)
        {
            var product = await _uow.Products.GetByIdAsync(item.ProductId)
                ?? throw new KeyNotFoundException($"Product {item.ProductId} not found.");
            var orderItem = new OrderItem { ProductId = item.ProductId, Quantity = item.Quantity, UnitPrice = product.Price };
            orderItems.Add(orderItem);
            total += orderItem.UnitPrice * orderItem.Quantity;
        }

        var order = new Order
        {
            OrderNumber = $"ORD-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString("N")[..6].ToUpper()}",
            Status = OrderStatus.Pending,
            TotalAmount = total,
            Notes = request.Notes,
            CustomerId = request.CustomerId,
            ShippingAddressId = request.ShippingAddressId,
            CreatedAt = DateTime.UtcNow,
            OrderItems = orderItems
        };

        await _uow.Orders.AddAsync(order);
        await _uow.SaveChangesAsync(cancellationToken);
        return order.Id;
    }
}
