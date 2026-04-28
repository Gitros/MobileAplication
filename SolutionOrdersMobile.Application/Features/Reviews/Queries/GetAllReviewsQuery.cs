using AutoMapper;
using MediatR;
using SolutionOrdersMobile.Application.Features.Reviews.DTOs;
using SolutionOrdersMobile.Domain.Interfaces.Repositories;

namespace SolutionOrdersMobile.Application.Features.Reviews.Queries;

public record GetAllReviewsQuery : IRequest<IEnumerable<ReviewDto>>;

public class GetAllReviewsQueryHandler : IRequestHandler<GetAllReviewsQuery, IEnumerable<ReviewDto>>
{
    private readonly IUnitOfWork _uow;
    private readonly IMapper _mapper;
    public GetAllReviewsQueryHandler(IUnitOfWork uow, IMapper mapper) { _uow = uow; _mapper = mapper; }

    public async Task<IEnumerable<ReviewDto>> Handle(GetAllReviewsQuery request, CancellationToken cancellationToken)
    {
        var reviews = await _uow.Reviews.GetAllAsync();
        return _mapper.Map<IEnumerable<ReviewDto>>(reviews);
    }
}
