using AutoMapper;
using MediatR;
using SolutionOrdersMobile.Application.Features.Addresses.DTOs;
using SolutionOrdersMobile.Domain.Interfaces.Repositories;

namespace SolutionOrdersMobile.Application.Features.Addresses.Queries;

public record GetAddressesByCustomerQuery(int CustomerId) : IRequest<IEnumerable<AddressDto>>;

public class GetAddressesByCustomerQueryHandler : IRequestHandler<GetAddressesByCustomerQuery, IEnumerable<AddressDto>>
{
    private readonly IUnitOfWork _uow;
    private readonly IMapper _mapper;
    public GetAddressesByCustomerQueryHandler(IUnitOfWork uow, IMapper mapper) { _uow = uow; _mapper = mapper; }

    public async Task<IEnumerable<AddressDto>> Handle(GetAddressesByCustomerQuery request, CancellationToken cancellationToken)
    {
        var addresses = await _uow.Addresses.GetByCustomerAsync(request.CustomerId);
        return _mapper.Map<IEnumerable<AddressDto>>(addresses);
    }
}
