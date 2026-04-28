namespace SolutionOrdersMobile.Domain.Entities;

public class Product
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public int StockQuantity { get; set; }
    public int? WeightGrams { get; set; }
    public string? ImageUrl { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; }
    public int BrandId { get; set; }
    public Brand Brand { get; set; } = null!;
    public int CategoryId { get; set; }
    public Category Category { get; set; } = null!;
    public ICollection<ProductTag> ProductTags { get; set; } = new List<ProductTag>();
    public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    public ICollection<Review> Reviews { get; set; } = new List<Review>();
}
