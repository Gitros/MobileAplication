using MediatR;
using SolutionOrdersMobile.Application.Common.Exceptions;
using SolutionOrdersMobile.Domain.Entities;
using SolutionOrdersMobile.Domain.Interfaces.Repositories;

namespace SolutionOrdersMobile.Application.Features.Reviews.Commands;

public record DeleteReviewCommand(int Id) : IRequest;

public class DeleteReviewCommandHandler : IRequestHandler<DeleteReviewCommand>
{
    private readonly IUnitOfWork _uow;
    public DeleteReviewCommandHandler(IUnitOfWork uow) => _uow = uow;

    public async Task Handle(DeleteReviewCommand request, CancellationToken cancellationToken)
    {
        var review = await _uow.Reviews.GetByIdAsync(request.Id)
            ?? throw new NotFoundException(nameof(Review), request.Id);
        _uow.Reviews.Remove(review);
        await _uow.SaveChangesAsync(cancellationToken);
    }
}
