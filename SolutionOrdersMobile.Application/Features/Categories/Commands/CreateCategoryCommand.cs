using FluentValidation;
using MediatR;
using SolutionOrdersMobile.Domain.Entities;
using SolutionOrdersMobile.Domain.Interfaces.Repositories;

namespace SolutionOrdersMobile.Application.Features.Categories.Commands;

public record CreateCategoryCommand(string Name, string? Description, string? IconUrl) : IRequest<int>;

public class CreateCategoryCommandValidator : AbstractValidator<CreateCategoryCommand>
{
    public CreateCategoryCommandValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(100);
    }
}

public class CreateCategoryCommandHandler : IRequestHandler<CreateCategoryCommand, int>
{
    private readonly IUnitOfWork _uow;
    public CreateCategoryCommandHandler(IUnitOfWork uow) => _uow = uow;

    public async Task<int> Handle(CreateCategoryCommand request, CancellationToken cancellationToken)
    {
        var category = new Category { Name = request.Name, Description = request.Description, IconUrl = request.IconUrl };
        await _uow.Categories.AddAsync(category);
        await _uow.SaveChangesAsync(cancellationToken);
        return category.Id;
    }
}
