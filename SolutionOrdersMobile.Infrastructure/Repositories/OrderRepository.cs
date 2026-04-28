using Microsoft.EntityFrameworkCore;
using SolutionOrdersMobile.Domain.Entities;
using SolutionOrdersMobile.Domain.Interfaces.Repositories;
using SolutionOrdersMobile.Infrastructure.Persistence;

namespace SolutionOrdersMobile.Infrastructure.Repositories;

public class OrderRepository : GenericRepository<Order>, IOrderRepository
{
    public OrderRepository(AppDbContext context) : base(context) { }

    public override async Task<IEnumerable<Order>> GetAllAsync() =>
        await _context.Orders
            .Include(o => o.Customer)
            .Include(o => o.ShippingAddress)
            .Include(o => o.OrderItems).ThenInclude(oi => oi.Product)
            .ToListAsync();

    public async Task<IEnumerable<Order>> GetByCustomerAsync(int customerId) =>
        await _context.Orders
            .Where(o => o.CustomerId == customerId)
            .Include(o => o.ShippingAddress)
            .Include(o => o.OrderItems).ThenInclude(oi => oi.Product)
            .ToListAsync();

    public async Task<Order?> GetWithItemsAsync(int id) =>
        await _context.Orders
            .Include(o => o.Customer)
            .Include(o => o.ShippingAddress)
            .Include(o => o.OrderItems).ThenInclude(oi => oi.Product)
            .FirstOrDefaultAsync(o => o.Id == id);
}
