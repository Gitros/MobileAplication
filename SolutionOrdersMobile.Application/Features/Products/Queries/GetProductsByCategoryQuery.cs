using AutoMapper;
using MediatR;
using SolutionOrdersMobile.Application.Features.Products.DTOs;
using SolutionOrdersMobile.Domain.Interfaces.Repositories;

namespace SolutionOrdersMobile.Application.Features.Products.Queries;

public record GetProductsByCategoryQuery(int CategoryId) : IRequest<IEnumerable<ProductDto>>;

public class GetProductsByCategoryQueryHandler : IRequestHandler<GetProductsByCategoryQuery, IEnumerable<ProductDto>>
{
    private readonly IUnitOfWork _uow;
    private readonly IMapper _mapper;
    public GetProductsByCategoryQueryHandler(IUnitOfWork uow, IMapper mapper) { _uow = uow; _mapper = mapper; }

    public async Task<IEnumerable<ProductDto>> Handle(GetProductsByCategoryQuery request, CancellationToken cancellationToken)
    {
        var products = await _uow.Products.GetByCategoryAsync(request.CategoryId);
        return _mapper.Map<IEnumerable<ProductDto>>(products);
    }
}
