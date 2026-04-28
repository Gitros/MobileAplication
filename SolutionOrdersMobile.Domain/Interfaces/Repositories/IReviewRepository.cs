using SolutionOrdersMobile.Domain.Entities;

namespace SolutionOrdersMobile.Domain.Interfaces.Repositories;

public interface IReviewRepository : IRepository<Review>
{
    Task<IEnumerable<Review>> GetByProductAsync(int productId);
}
