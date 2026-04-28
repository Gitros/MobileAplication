using SolutionOrdersMobile.Domain.Entities;

namespace SolutionOrdersMobile.Domain.Interfaces.Repositories;

public interface IProductRepository : IRepository<Product>
{
    Task<IEnumerable<Product>> GetByCategoryAsync(int categoryId);
    Task<IEnumerable<Product>> GetByBrandAsync(int brandId);
    Task<Product?> GetWithDetailsAsync(int id);
}
