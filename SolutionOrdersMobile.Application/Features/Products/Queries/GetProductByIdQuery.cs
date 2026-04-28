using AutoMapper;
using MediatR;
using SolutionOrdersMobile.Application.Common.Exceptions;
using SolutionOrdersMobile.Application.Features.Products.DTOs;
using SolutionOrdersMobile.Domain.Entities;
using SolutionOrdersMobile.Domain.Interfaces.Repositories;

namespace SolutionOrdersMobile.Application.Features.Products.Queries;

public record GetProductByIdQuery(int Id) : IRequest<ProductDto>;

public class GetProductByIdQueryHandler : IRequestHandler<GetProductByIdQuery, ProductDto>
{
    private readonly IUnitOfWork _uow;
    private readonly IMapper _mapper;
    public GetProductByIdQueryHandler(IUnitOfWork uow, IMapper mapper) { _uow = uow; _mapper = mapper; }

    public async Task<ProductDto> Handle(GetProductByIdQuery request, CancellationToken cancellationToken)
    {
        var product = await _uow.Products.GetWithDetailsAsync(request.Id)
            ?? throw new NotFoundException(nameof(Product), request.Id);
        return _mapper.Map<ProductDto>(product);
    }
}
