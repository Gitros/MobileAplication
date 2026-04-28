using AutoMapper;
using MediatR;
using SolutionOrdersMobile.Application.Features.Categories.DTOs;
using SolutionOrdersMobile.Domain.Interfaces.Repositories;

namespace SolutionOrdersMobile.Application.Features.Categories.Queries;

public record GetAllCategoriesQuery : IRequest<IEnumerable<CategoryDto>>;

public class GetAllCategoriesQueryHandler : IRequestHandler<GetAllCategoriesQuery, IEnumerable<CategoryDto>>
{
    private readonly IUnitOfWork _uow;
    private readonly IMapper _mapper;
    public GetAllCategoriesQueryHandler(IUnitOfWork uow, IMapper mapper) { _uow = uow; _mapper = mapper; }

    public async Task<IEnumerable<CategoryDto>> Handle(GetAllCategoriesQuery request, CancellationToken cancellationToken)
    {
        var categories = await _uow.Categories.GetAllAsync();
        return _mapper.Map<IEnumerable<CategoryDto>>(categories);
    }
}
