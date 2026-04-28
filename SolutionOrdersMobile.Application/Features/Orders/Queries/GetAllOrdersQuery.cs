using AutoMapper;
using MediatR;
using SolutionOrdersMobile.Application.Features.Orders.DTOs;
using SolutionOrdersMobile.Domain.Interfaces.Repositories;

namespace SolutionOrdersMobile.Application.Features.Orders.Queries;

public record GetAllOrdersQuery : IRequest<IEnumerable<OrderDto>>;

public class GetAllOrdersQueryHandler : IRequestHandler<GetAllOrdersQuery, IEnumerable<OrderDto>>
{
    private readonly IUnitOfWork _uow;
    private readonly IMapper _mapper;
    public GetAllOrdersQueryHandler(IUnitOfWork uow, IMapper mapper) { _uow = uow; _mapper = mapper; }

    public async Task<IEnumerable<OrderDto>> Handle(GetAllOrdersQuery request, CancellationToken cancellationToken)
    {
        var orders = await _uow.Orders.GetAllAsync();
        return _mapper.Map<IEnumerable<OrderDto>>(orders);
    }
}
