using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SolutionOrdersMobile.Domain.Entities;

namespace SolutionOrdersMobile.Infrastructure.Persistence.Configurations;

public class OrderConfiguration : IEntityTypeConfiguration<Order>
{
    public void Configure(EntityTypeBuilder<Order> builder)
    {
        builder.HasKey(o => o.Id);
        builder.Property(o => o.OrderNumber).IsRequired().HasMaxLength(50);
        builder.HasIndex(o => o.OrderNumber).IsUnique();
        builder.Property(o => o.Status).HasConversion<string>();
        builder.Property(o => o.TotalAmount).HasColumnType("decimal(18,2)");
        builder.Property(o => o.Notes).HasMaxLength(500);
        builder.Property(o => o.CreatedAt).HasDefaultValueSql("NOW()");
        builder.HasOne(o => o.Customer).WithMany(c => c.Orders).HasForeignKey(o => o.CustomerId).OnDelete(DeleteBehavior.Restrict);
        builder.HasOne(o => o.ShippingAddress).WithMany(a => a.Orders).HasForeignKey(o => o.ShippingAddressId).OnDelete(DeleteBehavior.Restrict);
    }
}
