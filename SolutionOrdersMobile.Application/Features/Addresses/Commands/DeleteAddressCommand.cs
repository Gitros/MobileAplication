using MediatR;
using SolutionOrdersMobile.Application.Common.Exceptions;
using SolutionOrdersMobile.Domain.Entities;
using SolutionOrdersMobile.Domain.Interfaces.Repositories;

namespace SolutionOrdersMobile.Application.Features.Addresses.Commands;

public record DeleteAddressCommand(int Id) : IRequest;

public class DeleteAddressCommandHandler : IRequestHandler<DeleteAddressCommand>
{
    private readonly IUnitOfWork _uow;
    public DeleteAddressCommandHandler(IUnitOfWork uow) => _uow = uow;

    public async Task Handle(DeleteAddressCommand request, CancellationToken cancellationToken)
    {
        var address = await _uow.Addresses.GetByIdAsync(request.Id)
            ?? throw new NotFoundException(nameof(Address), request.Id);
        _uow.Addresses.Remove(address);
        await _uow.SaveChangesAsync(cancellationToken);
    }
}
