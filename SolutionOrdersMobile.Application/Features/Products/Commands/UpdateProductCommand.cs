using FluentValidation;
using MediatR;
using SolutionOrdersMobile.Application.Common.Exceptions;
using SolutionOrdersMobile.Domain.Entities;
using SolutionOrdersMobile.Domain.Interfaces.Repositories;

namespace SolutionOrdersMobile.Application.Features.Products.Commands;

public record UpdateProductCommand(
    int Id,
    string Name,
    string? Description,
    decimal Price,
    int StockQuantity,
    int? WeightGrams,
    string? ImageUrl,
    bool IsActive,
    int BrandId,
    int CategoryId,
    List<int> TagIds) : IRequest;

public class UpdateProductCommandValidator : AbstractValidator<UpdateProductCommand>
{
    public UpdateProductCommandValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Price).GreaterThan(0);
        RuleFor(x => x.StockQuantity).GreaterThanOrEqualTo(0);
        RuleFor(x => x.BrandId).GreaterThan(0);
        RuleFor(x => x.CategoryId).GreaterThan(0);
    }
}

public class UpdateProductCommandHandler : IRequestHandler<UpdateProductCommand>
{
    private readonly IUnitOfWork _uow;
    public UpdateProductCommandHandler(IUnitOfWork uow) => _uow = uow;

    public async Task Handle(UpdateProductCommand request, CancellationToken cancellationToken)
    {
        var product = await _uow.Products.GetWithDetailsAsync(request.Id)
            ?? throw new NotFoundException(nameof(Product), request.Id);

        product.Name = request.Name;
        product.Description = request.Description;
        product.Price = request.Price;
        product.StockQuantity = request.StockQuantity;
        product.WeightGrams = request.WeightGrams;
        product.ImageUrl = request.ImageUrl;
        product.IsActive = request.IsActive;
        product.BrandId = request.BrandId;
        product.CategoryId = request.CategoryId;

        product.ProductTags.Clear();
        foreach (var tagId in request.TagIds)
            product.ProductTags.Add(new ProductTag { ProductId = product.Id, TagId = tagId });

        _uow.Products.Update(product);
        await _uow.SaveChangesAsync(cancellationToken);
    }
}
