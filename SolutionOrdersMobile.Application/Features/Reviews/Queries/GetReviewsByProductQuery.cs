using AutoMapper;
using MediatR;
using SolutionOrdersMobile.Application.Features.Reviews.DTOs;
using SolutionOrdersMobile.Domain.Interfaces.Repositories;

namespace SolutionOrdersMobile.Application.Features.Reviews.Queries;

public record GetReviewsByProductQuery(int ProductId) : IRequest<IEnumerable<ReviewDto>>;

public class GetReviewsByProductQueryHandler : IRequestHandler<GetReviewsByProductQuery, IEnumerable<ReviewDto>>
{
    private readonly IUnitOfWork _uow;
    private readonly IMapper _mapper;
    public GetReviewsByProductQueryHandler(IUnitOfWork uow, IMapper mapper) { _uow = uow; _mapper = mapper; }

    public async Task<IEnumerable<ReviewDto>> Handle(GetReviewsByProductQuery request, CancellationToken cancellationToken)
    {
        var reviews = await _uow.Reviews.GetByProductAsync(request.ProductId);
        return _mapper.Map<IEnumerable<ReviewDto>>(reviews);
    }
}
