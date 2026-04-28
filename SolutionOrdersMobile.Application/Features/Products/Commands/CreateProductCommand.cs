using FluentValidation;
using MediatR;
using SolutionOrdersMobile.Domain.Entities;
using SolutionOrdersMobile.Domain.Interfaces.Repositories;

namespace SolutionOrdersMobile.Application.Features.Products.Commands;

public record CreateProductCommand(
    string Name,
    string? Description,
    decimal Price,
    int StockQuantity,
    int? WeightGrams,
    string? ImageUrl,
    int BrandId,
    int CategoryId,
    List<int> TagIds) : IRequest<int>;

public class CreateProductCommandValidator : AbstractValidator<CreateProductCommand>
{
    public CreateProductCommandValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Price).GreaterThan(0);
        RuleFor(x => x.StockQuantity).GreaterThanOrEqualTo(0);
        RuleFor(x => x.BrandId).GreaterThan(0);
        RuleFor(x => x.CategoryId).GreaterThan(0);
    }
}

public class CreateProductCommandHandler : IRequestHandler<CreateProductCommand, int>
{
    private readonly IUnitOfWork _uow;
    public CreateProductCommandHandler(IUnitOfWork uow) => _uow = uow;

    public async Task<int> Handle(CreateProductCommand request, CancellationToken cancellationToken)
    {
        var product = new Product
        {
            Name = request.Name,
            Description = request.Description,
            Price = request.Price,
            StockQuantity = request.StockQuantity,
            WeightGrams = request.WeightGrams,
            ImageUrl = request.ImageUrl,
            BrandId = request.BrandId,
            CategoryId = request.CategoryId,
            CreatedAt = DateTime.UtcNow
        };

        foreach (var tagId in request.TagIds)
            product.ProductTags.Add(new ProductTag { TagId = tagId });

        await _uow.Products.AddAsync(product);
        await _uow.SaveChangesAsync(cancellationToken);
        return product.Id;
    }
}
