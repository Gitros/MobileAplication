using Microsoft.EntityFrameworkCore;
using SolutionOrdersMobile.Domain.Entities;
using SolutionOrdersMobile.Domain.Interfaces.Repositories;
using SolutionOrdersMobile.Infrastructure.Persistence;

namespace SolutionOrdersMobile.Infrastructure.Repositories;

public class ReviewRepository : GenericRepository<Review>, IReviewRepository
{
    public ReviewRepository(AppDbContext context) : base(context) { }

    public override async Task<IEnumerable<Review>> GetAllAsync() =>
        await _context.Reviews
            .Include(r => r.Customer)
            .Include(r => r.Product)
            .ToListAsync();

    public async Task<IEnumerable<Review>> GetByProductAsync(int productId) =>
        await _context.Reviews
            .Where(r => r.ProductId == productId)
            .Include(r => r.Customer)
            .ToListAsync();
}
