using Microsoft.EntityFrameworkCore;
using SolutionOrdersMobile.Domain.Entities;

namespace SolutionOrdersMobile.Infrastructure.Persistence;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Brand> Brands => Set<Brand>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<Tag> Tags => Set<Tag>();
    public DbSet<ProductTag> ProductTags => Set<ProductTag>();
    public DbSet<Customer> Customers => Set<Customer>();
    public DbSet<Address> Addresses => Set<Address>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();
    public DbSet<Review> Reviews => Set<Review>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
        base.OnModelCreating(modelBuilder);
    }
}
