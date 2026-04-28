using AutoMapper;
using MediatR;
using SolutionOrdersMobile.Application.Features.Customers.DTOs;
using SolutionOrdersMobile.Domain.Interfaces.Repositories;

namespace SolutionOrdersMobile.Application.Features.Customers.Queries;

public record GetAllCustomersQuery : IRequest<IEnumerable<CustomerDto>>;

public class GetAllCustomersQueryHandler : IRequestHandler<GetAllCustomersQuery, IEnumerable<CustomerDto>>
{
    private readonly IUnitOfWork _uow;
    private readonly IMapper _mapper;
    public GetAllCustomersQueryHandler(IUnitOfWork uow, IMapper mapper) { _uow = uow; _mapper = mapper; }

    public async Task<IEnumerable<CustomerDto>> Handle(GetAllCustomersQuery request, CancellationToken cancellationToken)
    {
        var customers = await _uow.Customers.GetAllAsync();
        return _mapper.Map<IEnumerable<CustomerDto>>(customers);
    }
}
