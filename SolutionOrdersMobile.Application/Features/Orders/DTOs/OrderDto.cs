namespace SolutionOrdersMobile.Application.Features.Orders.DTOs;

public record OrderItemDto(int Id, int ProductId, string ProductName, decimal UnitPrice, int Quantity);

public record OrderDto(
    int Id,
    string OrderNumber,
    string Status,
    decimal TotalAmount,
    string? Notes,
    DateTime CreatedAt,
    int CustomerId,
    string CustomerName,
    int ShippingAddressId,
    string ShippingAddress,
    List<OrderItemDto> Items);

public record CreateOrderItemDto(int ProductId, int Quantity);

public record CreateOrderDto(
    string? Notes,
    int CustomerId,
    int ShippingAddressId,
    List<CreateOrderItemDto> Items);

public record UpdateOrderStatusDto(string Status);
