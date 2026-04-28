using AutoMapper;
using MediatR;
using SolutionOrdersMobile.Application.Common.Exceptions;
using SolutionOrdersMobile.Application.Features.Addresses.DTOs;
using SolutionOrdersMobile.Domain.Entities;
using SolutionOrdersMobile.Domain.Interfaces.Repositories;

namespace SolutionOrdersMobile.Application.Features.Addresses.Queries;

public record GetAddressByIdQuery(int Id) : IRequest<AddressDto>;

public class GetAddressByIdQueryHandler : IRequestHandler<GetAddressByIdQuery, AddressDto>
{
    private readonly IUnitOfWork _uow;
    private readonly IMapper _mapper;
    public GetAddressByIdQueryHandler(IUnitOfWork uow, IMapper mapper) { _uow = uow; _mapper = mapper; }

    public async Task<AddressDto> Handle(GetAddressByIdQuery request, CancellationToken cancellationToken)
    {
        var address = await _uow.Addresses.GetByIdAsync(request.Id)
            ?? throw new NotFoundException(nameof(Address), request.Id);
        return _mapper.Map<AddressDto>(address);
    }
}
