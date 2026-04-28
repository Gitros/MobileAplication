using AutoMapper;
using MediatR;
using SolutionOrdersMobile.Application.Common.Exceptions;
using SolutionOrdersMobile.Application.Features.Reviews.DTOs;
using SolutionOrdersMobile.Domain.Entities;
using SolutionOrdersMobile.Domain.Interfaces.Repositories;

namespace SolutionOrdersMobile.Application.Features.Reviews.Queries;

public record GetReviewByIdQuery(int Id) : IRequest<ReviewDto>;

public class GetReviewByIdQueryHandler : IRequestHandler<GetReviewByIdQuery, ReviewDto>
{
    private readonly IUnitOfWork _uow;
    private readonly IMapper _mapper;
    public GetReviewByIdQueryHandler(IUnitOfWork uow, IMapper mapper) { _uow = uow; _mapper = mapper; }

    public async Task<ReviewDto> Handle(GetReviewByIdQuery request, CancellationToken cancellationToken)
    {
        var review = await _uow.Reviews.GetByIdAsync(request.Id)
            ?? throw new NotFoundException(nameof(Review), request.Id);
        return _mapper.Map<ReviewDto>(review);
    }
}
