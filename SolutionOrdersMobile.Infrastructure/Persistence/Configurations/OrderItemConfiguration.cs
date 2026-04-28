using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SolutionOrdersMobile.Domain.Entities;

namespace SolutionOrdersMobile.Infrastructure.Persistence.Configurations;

public class OrderItemConfiguration : IEntityTypeConfiguration<OrderItem>
{
    public void Configure(EntityTypeBuilder<OrderItem> builder)
    {
        builder.HasKey(oi => oi.Id);
        builder.Property(oi => oi.UnitPrice).HasColumnType("decimal(18,2)");
        builder.HasOne(oi => oi.Order).WithMany(o => o.OrderItems).HasForeignKey(oi => oi.OrderId).OnDelete(DeleteBehavior.Cascade);
        builder.HasOne(oi => oi.Product).WithMany(p => p.OrderItems).HasForeignKey(oi => oi.ProductId).OnDelete(DeleteBehavior.Restrict);
    }
}
