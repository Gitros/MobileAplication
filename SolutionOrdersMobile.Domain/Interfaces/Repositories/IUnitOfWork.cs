namespace SolutionOrdersMobile.Domain.Interfaces.Repositories;

public interface IUnitOfWork : IDisposable
{
    IBrandRepository Brands { get; }
    ICategoryRepository Categories { get; }
    IProductRepository Products { get; }
    ITagRepository Tags { get; }
    ICustomerRepository Customers { get; }
    IAddressRepository Addresses { get; }
    IOrderRepository Orders { get; }
    IReviewRepository Reviews { get; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
