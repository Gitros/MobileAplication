using FluentValidation;
using MediatR;
using SolutionOrdersMobile.Application.Common.Exceptions;
using SolutionOrdersMobile.Domain.Entities;
using SolutionOrdersMobile.Domain.Interfaces.Repositories;

namespace SolutionOrdersMobile.Application.Features.Customers.Commands;

public record UpdateCustomerCommand(int Id, string FirstName, string LastName, string Email, string? Phone) : IRequest;

public class UpdateCustomerCommandValidator : AbstractValidator<UpdateCustomerCommand>
{
    public UpdateCustomerCommandValidator()
    {
        RuleFor(x => x.FirstName).NotEmpty().MaximumLength(100);
        RuleFor(x => x.LastName).NotEmpty().MaximumLength(100);
        RuleFor(x => x.Email).NotEmpty().EmailAddress().MaximumLength(200);
    }
}

public class UpdateCustomerCommandHandler : IRequestHandler<UpdateCustomerCommand>
{
    private readonly IUnitOfWork _uow;
    public UpdateCustomerCommandHandler(IUnitOfWork uow) => _uow = uow;

    public async Task Handle(UpdateCustomerCommand request, CancellationToken cancellationToken)
    {
        var customer = await _uow.Customers.GetByIdAsync(request.Id)
            ?? throw new NotFoundException(nameof(Customer), request.Id);
        customer.FirstName = request.FirstName;
        customer.LastName = request.LastName;
        customer.Email = request.Email;
        customer.Phone = request.Phone;
        _uow.Customers.Update(customer);
        await _uow.SaveChangesAsync(cancellationToken);
    }
}
