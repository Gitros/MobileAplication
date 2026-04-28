namespace SolutionOrdersMobile.Application.Features.Categories.DTOs;

public record CategoryDto(int Id, string Name, string? Description, string? IconUrl);
public record CreateCategoryDto(string Name, string? Description, string? IconUrl);
public record UpdateCategoryDto(string Name, string? Description, string? IconUrl);
