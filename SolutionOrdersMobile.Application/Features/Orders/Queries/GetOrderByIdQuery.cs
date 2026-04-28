using AutoMapper;
using MediatR;
using SolutionOrdersMobile.Application.Common.Exceptions;
using SolutionOrdersMobile.Application.Features.Orders.DTOs;
using SolutionOrdersMobile.Domain.Entities;
using SolutionOrdersMobile.Domain.Interfaces.Repositories;

namespace SolutionOrdersMobile.Application.Features.Orders.Queries;

public record GetOrderByIdQuery(int Id) : IRequest<OrderDto>;

public class GetOrderByIdQueryHandler : IRequestHandler<GetOrderByIdQuery, OrderDto>
{
    private readonly IUnitOfWork _uow;
    private readonly IMapper _mapper;
    public GetOrderByIdQueryHandler(IUnitOfWork uow, IMapper mapper) { _uow = uow; _mapper = mapper; }

    public async Task<OrderDto> Handle(GetOrderByIdQuery request, CancellationToken cancellationToken)
    {
        var order = await _uow.Orders.GetWithItemsAsync(request.Id)
            ?? throw new NotFoundException(nameof(Order), request.Id);
        return _mapper.Map<OrderDto>(order);
    }
}
