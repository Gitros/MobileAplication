using Microsoft.EntityFrameworkCore;
using SolutionOrdersMobile.Domain.Entities;
using SolutionOrdersMobile.Domain.Interfaces.Repositories;
using SolutionOrdersMobile.Infrastructure.Persistence;

namespace SolutionOrdersMobile.Infrastructure.Repositories;

public class ProductRepository : GenericRepository<Product>, IProductRepository
{
    public ProductRepository(AppDbContext context) : base(context) { }

    public override async Task<IEnumerable<Product>> GetAllAsync() =>
        await _context.Products
            .Include(p => p.Brand)
            .Include(p => p.Category)
            .Include(p => p.ProductTags).ThenInclude(pt => pt.Tag)
            .ToListAsync();

    public override async Task<Product?> GetByIdAsync(int id) =>
        await _context.Products
            .Include(p => p.Brand)
            .Include(p => p.Category)
            .Include(p => p.ProductTags).ThenInclude(pt => pt.Tag)
            .FirstOrDefaultAsync(p => p.Id == id);

    public async Task<Product?> GetWithDetailsAsync(int id) => await GetByIdAsync(id);

    public async Task<IEnumerable<Product>> GetByCategoryAsync(int categoryId) =>
        await _context.Products
            .Where(p => p.CategoryId == categoryId)
            .Include(p => p.Brand)
            .Include(p => p.Category)
            .Include(p => p.ProductTags).ThenInclude(pt => pt.Tag)
            .ToListAsync();

    public async Task<IEnumerable<Product>> GetByBrandAsync(int brandId) =>
        await _context.Products
            .Where(p => p.BrandId == brandId)
            .Include(p => p.Brand)
            .Include(p => p.Category)
            .Include(p => p.ProductTags).ThenInclude(pt => pt.Tag)
            .ToListAsync();
}
