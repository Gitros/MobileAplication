using FluentValidation;
using MediatR;
using SolutionOrdersMobile.Domain.Entities;
using SolutionOrdersMobile.Domain.Interfaces.Repositories;

namespace SolutionOrdersMobile.Application.Features.Tags.Commands;

public record CreateTagCommand(string Name) : IRequest<int>;

public class CreateTagCommandValidator : AbstractValidator<CreateTagCommand>
{
    public CreateTagCommandValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(50);
    }
}

public class CreateTagCommandHandler : IRequestHandler<CreateTagCommand, int>
{
    private readonly IUnitOfWork _uow;
    public CreateTagCommandHandler(IUnitOfWork uow) => _uow = uow;

    public async Task<int> Handle(CreateTagCommand request, CancellationToken cancellationToken)
    {
        var tag = new Tag { Name = request.Name };
        await _uow.Tags.AddAsync(tag);
        await _uow.SaveChangesAsync(cancellationToken);
        return tag.Id;
    }
}
