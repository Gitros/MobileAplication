using SolutionOrdersMobile.Domain.Entities;
using SolutionOrdersMobile.Domain.Interfaces.Repositories;
using SolutionOrdersMobile.Infrastructure.Persistence;

namespace SolutionOrdersMobile.Infrastructure.Repositories;

public class CategoryRepository : GenericRepository<Category>, ICategoryRepository
{
    public CategoryRepository(AppDbContext context) : base(context) { }
}
