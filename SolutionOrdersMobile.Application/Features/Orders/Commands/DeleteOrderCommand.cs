using MediatR;
using SolutionOrdersMobile.Application.Common.Exceptions;
using SolutionOrdersMobile.Domain.Entities;
using SolutionOrdersMobile.Domain.Interfaces.Repositories;

namespace SolutionOrdersMobile.Application.Features.Orders.Commands;

public record DeleteOrderCommand(int Id) : IRequest;

public class DeleteOrderCommandHandler : IRequestHandler<DeleteOrderCommand>
{
    private readonly IUnitOfWork _uow;
    public DeleteOrderCommandHandler(IUnitOfWork uow) => _uow = uow;

    public async Task Handle(DeleteOrderCommand request, CancellationToken cancellationToken)
    {
        var order = await _uow.Orders.GetByIdAsync(request.Id)
            ?? throw new NotFoundException(nameof(Order), request.Id);
        _uow.Orders.Remove(order);
        await _uow.SaveChangesAsync(cancellationToken);
    }
}
