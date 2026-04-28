using FluentValidation;
using MediatR;
using SolutionOrdersMobile.Application.Common.Exceptions;
using SolutionOrdersMobile.Domain.Entities;
using SolutionOrdersMobile.Domain.Interfaces.Repositories;

namespace SolutionOrdersMobile.Application.Features.Addresses.Commands;

public record UpdateAddressCommand(int Id, string Street, string City, string PostalCode, string Country, bool IsDefault) : IRequest;

public class UpdateAddressCommandValidator : AbstractValidator<UpdateAddressCommand>
{
    public UpdateAddressCommandValidator()
    {
        RuleFor(x => x.Street).NotEmpty().MaximumLength(200);
        RuleFor(x => x.City).NotEmpty().MaximumLength(100);
        RuleFor(x => x.PostalCode).NotEmpty().MaximumLength(20);
        RuleFor(x => x.Country).NotEmpty().MaximumLength(100);
    }
}

public class UpdateAddressCommandHandler : IRequestHandler<UpdateAddressCommand>
{
    private readonly IUnitOfWork _uow;
    public UpdateAddressCommandHandler(IUnitOfWork uow) => _uow = uow;

    public async Task Handle(UpdateAddressCommand request, CancellationToken cancellationToken)
    {
        var address = await _uow.Addresses.GetByIdAsync(request.Id)
            ?? throw new NotFoundException(nameof(Address), request.Id);
        address.Street = request.Street;
        address.City = request.City;
        address.PostalCode = request.PostalCode;
        address.Country = request.Country;
        address.IsDefault = request.IsDefault;
        _uow.Addresses.Update(address);
        await _uow.SaveChangesAsync(cancellationToken);
    }
}
