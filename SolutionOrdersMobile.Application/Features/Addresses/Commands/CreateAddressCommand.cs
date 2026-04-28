using FluentValidation;
using MediatR;
using SolutionOrdersMobile.Domain.Entities;
using SolutionOrdersMobile.Domain.Interfaces.Repositories;

namespace SolutionOrdersMobile.Application.Features.Addresses.Commands;

public record CreateAddressCommand(string Street, string City, string PostalCode, string Country, bool IsDefault, int CustomerId) : IRequest<int>;

public class CreateAddressCommandValidator : AbstractValidator<CreateAddressCommand>
{
    public CreateAddressCommandValidator()
    {
        RuleFor(x => x.Street).NotEmpty().MaximumLength(200);
        RuleFor(x => x.City).NotEmpty().MaximumLength(100);
        RuleFor(x => x.PostalCode).NotEmpty().MaximumLength(20);
        RuleFor(x => x.Country).NotEmpty().MaximumLength(100);
        RuleFor(x => x.CustomerId).GreaterThan(0);
    }
}

public class CreateAddressCommandHandler : IRequestHandler<CreateAddressCommand, int>
{
    private readonly IUnitOfWork _uow;
    public CreateAddressCommandHandler(IUnitOfWork uow) => _uow = uow;

    public async Task<int> Handle(CreateAddressCommand request, CancellationToken cancellationToken)
    {
        var address = new Address
        {
            Street = request.Street,
            City = request.City,
            PostalCode = request.PostalCode,
            Country = request.Country,
            IsDefault = request.IsDefault,
            CustomerId = request.CustomerId
        };
        await _uow.Addresses.AddAsync(address);
        await _uow.SaveChangesAsync(cancellationToken);
        return address.Id;
    }
}
