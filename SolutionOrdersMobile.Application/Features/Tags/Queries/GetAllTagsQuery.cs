using AutoMapper;
using MediatR;
using SolutionOrdersMobile.Application.Features.Tags.DTOs;
using SolutionOrdersMobile.Domain.Interfaces.Repositories;

namespace SolutionOrdersMobile.Application.Features.Tags.Queries;

public record GetAllTagsQuery : IRequest<IEnumerable<TagDto>>;

public class GetAllTagsQueryHandler : IRequestHandler<GetAllTagsQuery, IEnumerable<TagDto>>
{
    private readonly IUnitOfWork _uow;
    private readonly IMapper _mapper;
    public GetAllTagsQueryHandler(IUnitOfWork uow, IMapper mapper) { _uow = uow; _mapper = mapper; }

    public async Task<IEnumerable<TagDto>> Handle(GetAllTagsQuery request, CancellationToken cancellationToken)
    {
        var tags = await _uow.Tags.GetAllAsync();
        return _mapper.Map<IEnumerable<TagDto>>(tags);
    }
}
