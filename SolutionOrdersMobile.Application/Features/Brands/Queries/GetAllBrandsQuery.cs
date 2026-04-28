using AutoMapper;
using MediatR;
using SolutionOrdersMobile.Application.Features.Brands.DTOs;
using SolutionOrdersMobile.Domain.Interfaces.Repositories;

namespace SolutionOrdersMobile.Application.Features.Brands.Queries;

public record GetAllBrandsQuery : IRequest<IEnumerable<BrandDto>>;

public class GetAllBrandsQueryHandler : IRequestHandler<GetAllBrandsQuery, IEnumerable<BrandDto>>
{
    private readonly IUnitOfWork _uow;
    private readonly IMapper _mapper;
    public GetAllBrandsQueryHandler(IUnitOfWork uow, IMapper mapper) { _uow = uow; _mapper = mapper; }

    public async Task<IEnumerable<BrandDto>> Handle(GetAllBrandsQuery request, CancellationToken cancellationToken)
    {
        var brands = await _uow.Brands.GetAllAsync();
        return _mapper.Map<IEnumerable<BrandDto>>(brands);
    }
}
