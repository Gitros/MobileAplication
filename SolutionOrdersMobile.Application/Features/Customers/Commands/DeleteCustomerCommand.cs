using MediatR;
using SolutionOrdersMobile.Application.Common.Exceptions;
using SolutionOrdersMobile.Domain.Entities;
using SolutionOrdersMobile.Domain.Interfaces.Repositories;

namespace SolutionOrdersMobile.Application.Features.Customers.Commands;

public record DeleteCustomerCommand(int Id) : IRequest;

public class DeleteCustomerCommandHandler : IRequestHandler<DeleteCustomerCommand>
{
    private readonly IUnitOfWork _uow;
    public DeleteCustomerCommandHandler(IUnitOfWork uow) => _uow = uow;

    public async Task Handle(DeleteCustomerCommand request, CancellationToken cancellationToken)
    {
        var customer = await _uow.Customers.GetByIdAsync(request.Id)
            ?? throw new NotFoundException(nameof(Customer), request.Id);
        _uow.Customers.Remove(customer);
        await _uow.SaveChangesAsync(cancellationToken);
    }
}
