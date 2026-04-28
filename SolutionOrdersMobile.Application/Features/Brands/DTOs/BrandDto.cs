namespace SolutionOrdersMobile.Application.Features.Brands.DTOs;

public record BrandDto(int Id, string Name, string? Description, string? LogoUrl, DateTime CreatedAt);
public record CreateBrandDto(string Name, string? Description, string? LogoUrl);
public record UpdateBrandDto(string Name, string? Description, string? LogoUrl);
