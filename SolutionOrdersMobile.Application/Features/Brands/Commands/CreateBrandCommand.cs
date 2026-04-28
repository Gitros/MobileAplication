using FluentValidation;
using MediatR;
using SolutionOrdersMobile.Domain.Entities;
using SolutionOrdersMobile.Domain.Interfaces.Repositories;

namespace SolutionOrdersMobile.Application.Features.Brands.Commands;

public record CreateBrandCommand(string Name, string? Description, string? LogoUrl) : IRequest<int>;

public class CreateBrandCommandValidator : AbstractValidator<CreateBrandCommand>
{
    public CreateBrandCommandValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(100);
    }
}

public class CreateBrandCommandHandler : IRequestHandler<CreateBrandCommand, int>
{
    private readonly IUnitOfWork _uow;
    public CreateBrandCommandHandler(IUnitOfWork uow) => _uow = uow;

    public async Task<int> Handle(CreateBrandCommand request, CancellationToken cancellationToken)
    {
        var brand = new Brand { Name = request.Name, Description = request.Description, LogoUrl = request.LogoUrl, CreatedAt = DateTime.UtcNow };
        await _uow.Brands.AddAsync(brand);
        await _uow.SaveChangesAsync(cancellationToken);
        return brand.Id;
    }
}
