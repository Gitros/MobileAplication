using MediatR;
using SolutionOrdersMobile.Application.Common.Exceptions;
using SolutionOrdersMobile.Domain.Entities;
using SolutionOrdersMobile.Domain.Interfaces.Repositories;

namespace SolutionOrdersMobile.Application.Features.Brands.Commands;

public record DeleteBrandCommand(int Id) : IRequest;

public class DeleteBrandCommandHandler : IRequestHandler<DeleteBrandCommand>
{
    private readonly IUnitOfWork _uow;
    public DeleteBrandCommandHandler(IUnitOfWork uow) => _uow = uow;

    public async Task Handle(DeleteBrandCommand request, CancellationToken cancellationToken)
    {
        var brand = await _uow.Brands.GetByIdAsync(request.Id)
            ?? throw new NotFoundException(nameof(Brand), request.Id);
        _uow.Brands.Remove(brand);
        await _uow.SaveChangesAsync(cancellationToken);
    }
}
