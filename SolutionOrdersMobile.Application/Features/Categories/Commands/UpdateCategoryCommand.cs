using FluentValidation;
using MediatR;
using SolutionOrdersMobile.Application.Common.Exceptions;
using SolutionOrdersMobile.Domain.Entities;
using SolutionOrdersMobile.Domain.Interfaces.Repositories;

namespace SolutionOrdersMobile.Application.Features.Categories.Commands;

public record UpdateCategoryCommand(int Id, string Name, string? Description, string? IconUrl) : IRequest;

public class UpdateCategoryCommandValidator : AbstractValidator<UpdateCategoryCommand>
{
    public UpdateCategoryCommandValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(100);
    }
}

public class UpdateCategoryCommandHandler : IRequestHandler<UpdateCategoryCommand>
{
    private readonly IUnitOfWork _uow;
    public UpdateCategoryCommandHandler(IUnitOfWork uow) => _uow = uow;

    public async Task Handle(UpdateCategoryCommand request, CancellationToken cancellationToken)
    {
        var category = await _uow.Categories.GetByIdAsync(request.Id)
            ?? throw new NotFoundException(nameof(Category), request.Id);
        category.Name = request.Name;
        category.Description = request.Description;
        category.IconUrl = request.IconUrl;
        _uow.Categories.Update(category);
        await _uow.SaveChangesAsync(cancellationToken);
    }
}
