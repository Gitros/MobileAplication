using AutoMapper;
using MediatR;
using SolutionOrdersMobile.Application.Features.Orders.DTOs;
using SolutionOrdersMobile.Domain.Interfaces.Repositories;

namespace SolutionOrdersMobile.Application.Features.Orders.Queries;

public record GetOrdersByCustomerQuery(int CustomerId) : IRequest<IEnumerable<OrderDto>>;

public class GetOrdersByCustomerQueryHandler : IRequestHandler<GetOrdersByCustomerQuery, IEnumerable<OrderDto>>
{
    private readonly IUnitOfWork _uow;
    private readonly IMapper _mapper;
    public GetOrdersByCustomerQueryHandler(IUnitOfWork uow, IMapper mapper) { _uow = uow; _mapper = mapper; }

    public async Task<IEnumerable<OrderDto>> Handle(GetOrdersByCustomerQuery request, CancellationToken cancellationToken)
    {
        var orders = await _uow.Orders.GetByCustomerAsync(request.CustomerId);
        return _mapper.Map<IEnumerable<OrderDto>>(orders);
    }
}
