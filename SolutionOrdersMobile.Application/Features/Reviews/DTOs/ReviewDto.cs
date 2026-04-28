namespace SolutionOrdersMobile.Application.Features.Reviews.DTOs;

public record ReviewDto(
    int Id,
    int Rating,
    string? Comment,
    DateTime CreatedAt,
    int CustomerId,
    string CustomerName,
    int ProductId,
    string ProductName);

public record CreateReviewDto(int Rating, string? Comment, int CustomerId, int ProductId);
public record UpdateReviewDto(int Rating, string? Comment);
