using AutoMapper;
using MediatR;
using SolutionOrdersMobile.Application.Common.Exceptions;
using SolutionOrdersMobile.Application.Features.Brands.DTOs;
using SolutionOrdersMobile.Domain.Entities;
using SolutionOrdersMobile.Domain.Interfaces.Repositories;

namespace SolutionOrdersMobile.Application.Features.Brands.Queries;

public record GetBrandByIdQuery(int Id) : IRequest<BrandDto>;

public class GetBrandByIdQueryHandler : IRequestHandler<GetBrandByIdQuery, BrandDto>
{
    private readonly IUnitOfWork _uow;
    private readonly IMapper _mapper;
    public GetBrandByIdQueryHandler(IUnitOfWork uow, IMapper mapper) { _uow = uow; _mapper = mapper; }

    public async Task<BrandDto> Handle(GetBrandByIdQuery request, CancellationToken cancellationToken)
    {
        var brand = await _uow.Brands.GetByIdAsync(request.Id)
            ?? throw new NotFoundException(nameof(Brand), request.Id);
        return _mapper.Map<BrandDto>(brand);
    }
}
