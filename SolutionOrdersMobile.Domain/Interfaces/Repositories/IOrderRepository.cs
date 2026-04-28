using SolutionOrdersMobile.Domain.Entities;

namespace SolutionOrdersMobile.Domain.Interfaces.Repositories;

public interface IOrderRepository : IRepository<Order>
{
    Task<IEnumerable<Order>> GetByCustomerAsync(int customerId);
    Task<Order?> GetWithItemsAsync(int id);
}
