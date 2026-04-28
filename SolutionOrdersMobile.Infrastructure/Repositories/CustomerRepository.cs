using Microsoft.EntityFrameworkCore;
using SolutionOrdersMobile.Domain.Entities;
using SolutionOrdersMobile.Domain.Interfaces.Repositories;
using SolutionOrdersMobile.Infrastructure.Persistence;

namespace SolutionOrdersMobile.Infrastructure.Repositories;

public class CustomerRepository : GenericRepository<Customer>, ICustomerRepository
{
    public CustomerRepository(AppDbContext context) : base(context) { }

    public async Task<Customer?> GetByEmailAsync(string email) =>
        await _context.Customers.FirstOrDefaultAsync(c => c.Email == email);
}
