using FluentValidation;
using MediatR;
using SolutionOrdersMobile.Application.Common.Exceptions;
using SolutionOrdersMobile.Domain.Entities;
using SolutionOrdersMobile.Domain.Interfaces.Repositories;

namespace SolutionOrdersMobile.Application.Features.Reviews.Commands;

public record UpdateReviewCommand(int Id, int Rating, string? Comment) : IRequest;

public class UpdateReviewCommandValidator : AbstractValidator<UpdateReviewCommand>
{
    public UpdateReviewCommandValidator()
    {
        RuleFor(x => x.Rating).InclusiveBetween(1, 5);
        RuleFor(x => x.Comment).MaximumLength(1000).When(x => x.Comment != null);
    }
}

public class UpdateReviewCommandHandler : IRequestHandler<UpdateReviewCommand>
{
    private readonly IUnitOfWork _uow;
    public UpdateReviewCommandHandler(IUnitOfWork uow) => _uow = uow;

    public async Task Handle(UpdateReviewCommand request, CancellationToken cancellationToken)
    {
        var review = await _uow.Reviews.GetByIdAsync(request.Id)
            ?? throw new NotFoundException(nameof(Review), request.Id);
        review.Rating = request.Rating;
        review.Comment = request.Comment;
        _uow.Reviews.Update(review);
        await _uow.SaveChangesAsync(cancellationToken);
    }
}
