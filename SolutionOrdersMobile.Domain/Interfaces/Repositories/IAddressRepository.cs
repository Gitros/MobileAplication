using SolutionOrdersMobile.Domain.Entities;

namespace SolutionOrdersMobile.Domain.Interfaces.Repositories;

public interface IAddressRepository : IRepository<Address>
{
    Task<IEnumerable<Address>> GetByCustomerAsync(int customerId);
}
