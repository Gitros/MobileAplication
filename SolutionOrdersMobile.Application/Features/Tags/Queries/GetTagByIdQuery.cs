using AutoMapper;
using MediatR;
using SolutionOrdersMobile.Application.Common.Exceptions;
using SolutionOrdersMobile.Application.Features.Tags.DTOs;
using SolutionOrdersMobile.Domain.Entities;
using SolutionOrdersMobile.Domain.Interfaces.Repositories;

namespace SolutionOrdersMobile.Application.Features.Tags.Queries;

public record GetTagByIdQuery(int Id) : IRequest<TagDto>;

public class GetTagByIdQueryHandler : IRequestHandler<GetTagByIdQuery, TagDto>
{
    private readonly IUnitOfWork _uow;
    private readonly IMapper _mapper;
    public GetTagByIdQueryHandler(IUnitOfWork uow, IMapper mapper) { _uow = uow; _mapper = mapper; }

    public async Task<TagDto> Handle(GetTagByIdQuery request, CancellationToken cancellationToken)
    {
        var tag = await _uow.Tags.GetByIdAsync(request.Id)
            ?? throw new NotFoundException(nameof(Tag), request.Id);
        return _mapper.Map<TagDto>(tag);
    }
}
