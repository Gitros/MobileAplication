using Microsoft.EntityFrameworkCore;
using SolutionOrdersMobile.Domain.Entities;
using SolutionOrdersMobile.Domain.Interfaces.Repositories;
using SolutionOrdersMobile.Infrastructure.Persistence;

namespace SolutionOrdersMobile.Infrastructure.Repositories;

public class AddressRepository : GenericRepository<Address>, IAddressRepository
{
    public AddressRepository(AppDbContext context) : base(context) { }

    public async Task<IEnumerable<Address>> GetByCustomerAsync(int customerId) =>
        await _context.Addresses.Where(a => a.CustomerId == customerId).ToListAsync();
}
