using FluentValidation;
using MediatR;
using SolutionOrdersMobile.Application.Common.Exceptions;
using SolutionOrdersMobile.Domain.Entities;
using SolutionOrdersMobile.Domain.Interfaces.Repositories;

namespace SolutionOrdersMobile.Application.Features.Tags.Commands;

public record UpdateTagCommand(int Id, string Name) : IRequest;

public class UpdateTagCommandValidator : AbstractValidator<UpdateTagCommand>
{
    public UpdateTagCommandValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(50);
    }
}

public class UpdateTagCommandHandler : IRequestHandler<UpdateTagCommand>
{
    private readonly IUnitOfWork _uow;
    public UpdateTagCommandHandler(IUnitOfWork uow) => _uow = uow;

    public async Task Handle(UpdateTagCommand request, CancellationToken cancellationToken)
    {
        var tag = await _uow.Tags.GetByIdAsync(request.Id)
            ?? throw new NotFoundException(nameof(Tag), request.Id);
        tag.Name = request.Name;
        _uow.Tags.Update(tag);
        await _uow.SaveChangesAsync(cancellationToken);
    }
}
