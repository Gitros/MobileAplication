namespace SolutionOrdersMobile.Application.Features.Addresses.DTOs;

public record AddressDto(int Id, string Street, string City, string PostalCode, string Country, bool IsDefault, int CustomerId);
public record CreateAddressDto(string Street, string City, string PostalCode, string Country, bool IsDefault, int CustomerId);
public record UpdateAddressDto(string Street, string City, string PostalCode, string Country, bool IsDefault);
