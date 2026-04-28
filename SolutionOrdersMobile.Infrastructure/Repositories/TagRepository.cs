using SolutionOrdersMobile.Domain.Entities;
using SolutionOrdersMobile.Domain.Interfaces.Repositories;
using SolutionOrdersMobile.Infrastructure.Persistence;

namespace SolutionOrdersMobile.Infrastructure.Repositories;

public class TagRepository : GenericRepository<Tag>, ITagRepository
{
    public TagRepository(AppDbContext context) : base(context) { }
}
