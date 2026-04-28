using SolutionOrdersMobile.Domain.Interfaces.Repositories;
using SolutionOrdersMobile.Infrastructure.Persistence;

namespace SolutionOrdersMobile.Infrastructure.Repositories;

public class UnitOfWork : IUnitOfWork
{
    private readonly AppDbContext _context;

    public IBrandRepository Brands { get; }
    public ICategoryRepository Categories { get; }
    public IProductRepository Products { get; }
    public ITagRepository Tags { get; }
    public ICustomerRepository Customers { get; }
    public IAddressRepository Addresses { get; }
    public IOrderRepository Orders { get; }
    public IReviewRepository Reviews { get; }

    public UnitOfWork(
        AppDbContext context,
        IBrandRepository brands,
        ICategoryRepository categories,
        IProductRepository products,
        ITagRepository tags,
        ICustomerRepository customers,
        IAddressRepository addresses,
        IOrderRepository orders,
        IReviewRepository reviews)
    {
        _context = context;
        Brands = brands;
        Categories = categories;
        Products = products;
        Tags = tags;
        Customers = customers;
        Addresses = addresses;
        Orders = orders;
        Reviews = reviews;
    }

    public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default) =>
        await _context.SaveChangesAsync(cancellationToken);

    public void Dispose() => _context.Dispose();
}
