using AutoMapper;
using MediatR;
using SolutionOrdersMobile.Application.Features.Products.DTOs;
using SolutionOrdersMobile.Domain.Interfaces.Repositories;

namespace SolutionOrdersMobile.Application.Features.Products.Queries;

public record GetAllProductsQuery : IRequest<IEnumerable<ProductDto>>;

public class GetAllProductsQueryHandler : IRequestHandler<GetAllProductsQuery, IEnumerable<ProductDto>>
{
    private readonly IUnitOfWork _uow;
    private readonly IMapper _mapper;
    public GetAllProductsQueryHandler(IUnitOfWork uow, IMapper mapper) { _uow = uow; _mapper = mapper; }

    public async Task<IEnumerable<ProductDto>> Handle(GetAllProductsQuery request, CancellationToken cancellationToken)
    {
        var products = await _uow.Products.GetAllAsync();
        return _mapper.Map<IEnumerable<ProductDto>>(products);
    }
}
