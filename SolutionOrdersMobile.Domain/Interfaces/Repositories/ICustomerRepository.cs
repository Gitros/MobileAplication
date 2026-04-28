using SolutionOrdersMobile.Domain.Entities;

namespace SolutionOrdersMobile.Domain.Interfaces.Repositories;

public interface ICustomerRepository : IRepository<Customer>
{
    Task<Customer?> GetByEmailAsync(string email);
}
