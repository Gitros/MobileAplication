using AutoMapper;
using MediatR;
using SolutionOrdersMobile.Application.Features.Addresses.DTOs;
using SolutionOrdersMobile.Domain.Interfaces.Repositories;

namespace SolutionOrdersMobile.Application.Features.Addresses.Queries;

public record GetAllAddressesQuery : IRequest<IEnumerable<AddressDto>>;

public class GetAllAddressesQueryHandler : IRequestHandler<GetAllAddressesQuery, IEnumerable<AddressDto>>
{
    private readonly IUnitOfWork _uow;
    private readonly IMapper _mapper;
    public GetAllAddressesQueryHandler(IUnitOfWork uow, IMapper mapper) { _uow = uow; _mapper = mapper; }

    public async Task<IEnumerable<AddressDto>> Handle(GetAllAddressesQuery request, CancellationToken cancellationToken)
    {
        var addresses = await _uow.Addresses.GetAllAsync();
        return _mapper.Map<IEnumerable<AddressDto>>(addresses);
    }
}
