using FluentValidation;
using MediatR;
using SolutionOrdersMobile.Domain.Entities;
using SolutionOrdersMobile.Domain.Interfaces.Repositories;

namespace SolutionOrdersMobile.Application.Features.Reviews.Commands;

public record CreateReviewCommand(int Rating, string? Comment, int CustomerId, int ProductId) : IRequest<int>;

public class CreateReviewCommandValidator : AbstractValidator<CreateReviewCommand>
{
    public CreateReviewCommandValidator()
    {
        RuleFor(x => x.Rating).InclusiveBetween(1, 5);
        RuleFor(x => x.Comment).MaximumLength(1000).When(x => x.Comment != null);
        RuleFor(x => x.CustomerId).GreaterThan(0);
        RuleFor(x => x.ProductId).GreaterThan(0);
    }
}

public class CreateReviewCommandHandler : IRequestHandler<CreateReviewCommand, int>
{
    private readonly IUnitOfWork _uow;
    public CreateReviewCommandHandler(IUnitOfWork uow) => _uow = uow;

    public async Task<int> Handle(CreateReviewCommand request, CancellationToken cancellationToken)
    {
        var review = new Review
        {
            Rating = request.Rating,
            Comment = request.Comment,
            CustomerId = request.CustomerId,
            ProductId = request.ProductId,
            CreatedAt = DateTime.UtcNow
        };
        await _uow.Reviews.AddAsync(review);
        await _uow.SaveChangesAsync(cancellationToken);
        return review.Id;
    }
}
