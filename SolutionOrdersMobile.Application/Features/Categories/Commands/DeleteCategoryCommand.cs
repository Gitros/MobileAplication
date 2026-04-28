using MediatR;
using SolutionOrdersMobile.Application.Common.Exceptions;
using SolutionOrdersMobile.Domain.Entities;
using SolutionOrdersMobile.Domain.Interfaces.Repositories;

namespace SolutionOrdersMobile.Application.Features.Categories.Commands;

public record DeleteCategoryCommand(int Id) : IRequest;

public class DeleteCategoryCommandHandler : IRequestHandler<DeleteCategoryCommand>
{
    private readonly IUnitOfWork _uow;
    public DeleteCategoryCommandHandler(IUnitOfWork uow) => _uow = uow;

    public async Task Handle(DeleteCategoryCommand request, CancellationToken cancellationToken)
    {
        var category = await _uow.Categories.GetByIdAsync(request.Id)
            ?? throw new NotFoundException(nameof(Category), request.Id);
        _uow.Categories.Remove(category);
        await _uow.SaveChangesAsync(cancellationToken);
    }
}
