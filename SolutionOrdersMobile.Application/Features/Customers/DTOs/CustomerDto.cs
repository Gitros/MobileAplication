namespace SolutionOrdersMobile.Application.Features.Customers.DTOs;

public record CustomerDto(int Id, string FirstName, string LastName, string Email, string? Phone, DateTime CreatedAt);
public record CreateCustomerDto(string FirstName, string LastName, string Email, string? Phone);
public record UpdateCustomerDto(string FirstName, string LastName, string Email, string? Phone);
