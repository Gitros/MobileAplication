namespace SolutionOrdersMobile.Application.Features.Products.DTOs;

public record ProductDto(
    int Id,
    string Name,
    string? Description,
    decimal Price,
    int StockQuantity,
    int? WeightGrams,
    string? ImageUrl,
    bool IsActive,
    DateTime CreatedAt,
    int BrandId,
    string BrandName,
    int CategoryId,
    string CategoryName,
    List<string> Tags);

public record CreateProductDto(
    string Name,
    string? Description,
    decimal Price,
    int StockQuantity,
    int? WeightGrams,
    string? ImageUrl,
    int BrandId,
    int CategoryId,
    List<int> TagIds);

public record UpdateProductDto(
    string Name,
    string? Description,
    decimal Price,
    int StockQuantity,
    int? WeightGrams,
    string? ImageUrl,
    bool IsActive,
    int BrandId,
    int CategoryId,
    List<int> TagIds);
