using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SolutionOrdersMobile.Domain.Entities;

namespace SolutionOrdersMobile.Infrastructure.Persistence.Configurations;

public class ProductConfiguration : IEntityTypeConfiguration<Product>
{
    public void Configure(EntityTypeBuilder<Product> builder)
    {
        builder.HasKey(p => p.Id);
        builder.Property(p => p.Name).IsRequired().HasMaxLength(200);
        builder.Property(p => p.Description).HasMaxLength(2000);
        builder.Property(p => p.Price).HasColumnType("decimal(18,2)");
        builder.Property(p => p.IsActive).HasDefaultValue(true);
        builder.Property(p => p.CreatedAt).HasDefaultValueSql("NOW()");
        builder.HasOne(p => p.Brand).WithMany(b => b.Products).HasForeignKey(p => p.BrandId).OnDelete(DeleteBehavior.Restrict);
        builder.HasOne(p => p.Category).WithMany(c => c.Products).HasForeignKey(p => p.CategoryId).OnDelete(DeleteBehavior.Restrict);
    }
}
