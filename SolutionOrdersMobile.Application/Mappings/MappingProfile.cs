using AutoMapper;
using SolutionOrdersMobile.Application.Features.Addresses.DTOs;
using SolutionOrdersMobile.Application.Features.Brands.DTOs;
using SolutionOrdersMobile.Application.Features.Categories.DTOs;
using SolutionOrdersMobile.Application.Features.Customers.DTOs;
using SolutionOrdersMobile.Application.Features.Orders.DTOs;
using SolutionOrdersMobile.Application.Features.Products.DTOs;
using SolutionOrdersMobile.Application.Features.Reviews.DTOs;
using SolutionOrdersMobile.Application.Features.Tags.DTOs;
using SolutionOrdersMobile.Domain.Entities;

namespace SolutionOrdersMobile.Application.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<Brand, BrandDto>();
        CreateMap<Category, CategoryDto>();
        CreateMap<Tag, TagDto>();

        CreateMap<Product, ProductDto>()
            .ForCtorParam("BrandName", o => o.MapFrom(s => s.Brand.Name))
            .ForCtorParam("CategoryName", o => o.MapFrom(s => s.Category.Name))
            .ForCtorParam("Tags", o => o.MapFrom(s => s.ProductTags.Select(pt => pt.Tag.Name).ToList()));

        CreateMap<Customer, CustomerDto>();
        CreateMap<Address, AddressDto>();

        CreateMap<OrderItem, OrderItemDto>()
            .ForCtorParam("ProductName", o => o.MapFrom(s => s.Product.Name));

        CreateMap<Order, OrderDto>()
            .ForCtorParam("Status", o => o.MapFrom(s => s.Status.ToString()))
            .ForCtorParam("CustomerName", o => o.MapFrom(s => s.Customer.FirstName + " " + s.Customer.LastName))
            .ForCtorParam("ShippingAddress", o => o.MapFrom(s => s.ShippingAddress.Street + ", " + s.ShippingAddress.City))
            .ForCtorParam("Items", o => o.MapFrom(s => s.OrderItems));

        CreateMap<Review, ReviewDto>()
            .ForCtorParam("CustomerName", o => o.MapFrom(s => s.Customer.FirstName + " " + s.Customer.LastName))
            .ForCtorParam("ProductName", o => o.MapFrom(s => s.Product.Name));
    }
}
