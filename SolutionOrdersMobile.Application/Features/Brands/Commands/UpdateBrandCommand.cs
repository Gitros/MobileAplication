using FluentValidation;
using MediatR;
using SolutionOrdersMobile.Application.Common.Exceptions;
using SolutionOrdersMobile.Domain.Entities;
using SolutionOrdersMobile.Domain.Interfaces.Repositories;

namespace SolutionOrdersMobile.Application.Features.Brands.Commands;

public record UpdateBrandCommand(int Id, string Name, string? Description, string? LogoUrl) : IRequest;

public class UpdateBrandCommandValidator : AbstractValidator<UpdateBrandCommand>
{
    public UpdateBrandCommandValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(100);
    }
}

public class UpdateBrandCommandHandler : IRequestHandler<UpdateBrandCommand>
{
    private readonly IUnitOfWork _uow;
    public UpdateBrandCommandHandler(IUnitOfWork uow) => _uow = uow;

    public async Task Handle(UpdateBrandCommand request, CancellationToken cancellationToken)
    {
        var brand = await _uow.Brands.GetByIdAsync(request.Id)
            ?? throw new NotFoundException(nameof(Brand), request.Id);
        brand.Name = request.Name;
        brand.Description = request.Description;
        brand.LogoUrl = request.LogoUrl;
        _uow.Brands.Update(brand);
        await _uow.SaveChangesAsync(cancellationToken);
    }
}
