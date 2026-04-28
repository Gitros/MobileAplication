using FluentValidation;
using MediatR;
using SolutionOrdersMobile.Application.Common.Exceptions;
using SolutionOrdersMobile.Domain.Entities;
using SolutionOrdersMobile.Domain.Enums;
using SolutionOrdersMobile.Domain.Interfaces.Repositories;

namespace SolutionOrdersMobile.Application.Features.Orders.Commands;

public record UpdateOrderStatusCommand(int Id, string Status) : IRequest;

public class UpdateOrderStatusCommandValidator : AbstractValidator<UpdateOrderStatusCommand>
{
    public UpdateOrderStatusCommandValidator()
    {
        RuleFor(x => x.Status).NotEmpty()
            .Must(s => Enum.TryParse<OrderStatus>(s, true, out _))
            .WithMessage("Invalid order status.");
    }
}

public class UpdateOrderStatusCommandHandler : IRequestHandler<UpdateOrderStatusCommand>
{
    private readonly IUnitOfWork _uow;
    public UpdateOrderStatusCommandHandler(IUnitOfWork uow) => _uow = uow;

    public async Task Handle(UpdateOrderStatusCommand request, CancellationToken cancellationToken)
    {
        var order = await _uow.Orders.GetByIdAsync(request.Id)
            ?? throw new NotFoundException(nameof(Order), request.Id);
        order.Status = Enum.Parse<OrderStatus>(request.Status, true);
        _uow.Orders.Update(order);
        await _uow.SaveChangesAsync(cancellationToken);
    }
}
