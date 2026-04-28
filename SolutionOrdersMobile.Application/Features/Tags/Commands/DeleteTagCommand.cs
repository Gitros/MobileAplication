using MediatR;
using SolutionOrdersMobile.Application.Common.Exceptions;
using SolutionOrdersMobile.Domain.Entities;
using SolutionOrdersMobile.Domain.Interfaces.Repositories;

namespace SolutionOrdersMobile.Application.Features.Tags.Commands;

public record DeleteTagCommand(int Id) : IRequest;

public class DeleteTagCommandHandler : IRequestHandler<DeleteTagCommand>
{
    private readonly IUnitOfWork _uow;
    public DeleteTagCommandHandler(IUnitOfWork uow) => _uow = uow;

    public async Task Handle(DeleteTagCommand request, CancellationToken cancellationToken)
    {
        var tag = await _uow.Tags.GetByIdAsync(request.Id)
            ?? throw new NotFoundException(nameof(Tag), request.Id);
        _uow.Tags.Remove(tag);
        await _uow.SaveChangesAsync(cancellationToken);
    }
}
