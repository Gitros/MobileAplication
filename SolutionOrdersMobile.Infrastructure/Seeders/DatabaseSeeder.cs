using Microsoft.EntityFrameworkCore;
using SolutionOrdersMobile.Domain.Entities;
using SolutionOrdersMobile.Infrastructure.Persistence;

namespace SolutionOrdersMobile.Infrastructure.Seeders;

public static class DatabaseSeeder
{
    public static async Task SeedAsync(AppDbContext db)
    {
        if (await db.Brands.AnyAsync()) return;

        var brands = new List<Brand>
        {
            new() { Name = "Optimum Nutrition", Description = "World's #1 selling protein brand", CreatedAt = DateTime.UtcNow },
            new() { Name = "MyProtein", Description = "Europe's leading sports nutrition brand", CreatedAt = DateTime.UtcNow },
            new() { Name = "Scitec Nutrition", Description = "Premium Hungarian sports nutrition", CreatedAt = DateTime.UtcNow },
            new() { Name = "BSN", Description = "Bio-Engineered Supplements and Nutrition", CreatedAt = DateTime.UtcNow },
            new() { Name = "Dymatize", Description = "Elite performance nutrition", CreatedAt = DateTime.UtcNow },
        };
        await db.Brands.AddRangeAsync(brands);

        var categories = new List<Category>
        {
            new() { Name = "Protein", Description = "Whey, casein, plant-based proteins" },
            new() { Name = "Creatine", Description = "Creatine monohydrate and blends" },
            new() { Name = "Pre-Workout", Description = "Pre-workout stimulants and pumps" },
            new() { Name = "Vitamins", Description = "Vitamins and micronutrients" },
            new() { Name = "Amino Acids", Description = "BCAAs, EAAs, glutamine" },
            new() { Name = "Weight Gainers", Description = "Mass gainers and calorie boosters" },
            new() { Name = "Fat Burners", Description = "Thermogenics and metabolism support" },
            new() { Name = "Bars & Snacks", Description = "Protein bars and healthy snacks" },
        };
        await db.Categories.AddRangeAsync(categories);

        var tags = new List<Tag>
        {
            new() { Name = "Vegan" },
            new() { Name = "Gluten-Free" },
            new() { Name = "Sugar-Free" },
            new() { Name = "Lactose-Free" },
            new() { Name = "High-Protein" },
            new() { Name = "Low-Carb" },
            new() { Name = "Bestseller" },
            new() { Name = "New" },
            new() { Name = "Sale" },
            new() { Name = "Natural" },
        };
        await db.Tags.AddRangeAsync(tags);

        await db.SaveChangesAsync();

        var products = new List<Product>
        {
            new() { Name = "Gold Standard 100% Whey", Description = "24g protein per serving, world's best-selling protein", Price = 149.99m, StockQuantity = 200, WeightGrams = 909, BrandId = brands[0].Id, CategoryId = categories[0].Id, IsActive = true, CreatedAt = DateTime.UtcNow },
            new() { Name = "Impact Whey Protein", Description = "High-quality whey concentrate, 82% protein", Price = 89.99m, StockQuantity = 350, WeightGrams = 1000, BrandId = brands[1].Id, CategoryId = categories[0].Id, IsActive = true, CreatedAt = DateTime.UtcNow },
            new() { Name = "100% Whey Professional", Description = "Triple-filtered whey with digestive enzymes", Price = 129.99m, StockQuantity = 180, WeightGrams = 920, BrandId = brands[2].Id, CategoryId = categories[0].Id, IsActive = true, CreatedAt = DateTime.UtcNow },
            new() { Name = "Syntha-6 Protein Powder", Description = "Multi-source protein blend with great taste", Price = 159.99m, StockQuantity = 150, WeightGrams = 1320, BrandId = brands[3].Id, CategoryId = categories[0].Id, IsActive = true, CreatedAt = DateTime.UtcNow },
            new() { Name = "ISO-100 Hydrolyzed", Description = "Fastest absorbing hydrolyzed whey isolate", Price = 199.99m, StockQuantity = 120, WeightGrams = 725, BrandId = brands[4].Id, CategoryId = categories[0].Id, IsActive = true, CreatedAt = DateTime.UtcNow },
            new() { Name = "Micronized Creatine Powder", Description = "Pure creatine monohydrate, unflavored", Price = 49.99m, StockQuantity = 500, WeightGrams = 317, BrandId = brands[0].Id, CategoryId = categories[1].Id, IsActive = true, CreatedAt = DateTime.UtcNow },
            new() { Name = "Creatine Monohydrate Powder", Description = "200 mesh micronized creatine", Price = 29.99m, StockQuantity = 600, WeightGrams = 500, BrandId = brands[1].Id, CategoryId = categories[1].Id, IsActive = true, CreatedAt = DateTime.UtcNow },
            new() { Name = "C4 Original Pre-Workout", Description = "Explosive energy and performance", Price = 99.99m, StockQuantity = 250, WeightGrams = 195, BrandId = brands[3].Id, CategoryId = categories[2].Id, IsActive = true, CreatedAt = DateTime.UtcNow },
            new() { Name = "Opti-Men Multivitamin", Description = "Comprehensive men's multivitamin with 75+ ingredients", Price = 79.99m, StockQuantity = 300, WeightGrams = 150, BrandId = brands[0].Id, CategoryId = categories[3].Id, IsActive = true, CreatedAt = DateTime.UtcNow },
            new() { Name = "Instantized BCAA 5000", Description = "2:1:1 ratio BCAAs for muscle recovery", Price = 69.99m, StockQuantity = 280, WeightGrams = 336, BrandId = brands[0].Id, CategoryId = categories[4].Id, IsActive = true, CreatedAt = DateTime.UtcNow },
            new() { Name = "Serious Mass", Description = "High-calorie weight gainer, 1250 calories per serving", Price = 179.99m, StockQuantity = 100, WeightGrams = 2720, BrandId = brands[0].Id, CategoryId = categories[5].Id, IsActive = true, CreatedAt = DateTime.UtcNow },
            new() { Name = "Lean Mode Fat Burner", Description = "Stimulant-free fat burning support", Price = 89.99m, StockQuantity = 200, WeightGrams = 150, BrandId = brands[4].Id, CategoryId = categories[6].Id, IsActive = true, CreatedAt = DateTime.UtcNow },
            new() { Name = "Protein Crispy Bar", Description = "20g protein, only 212 calories", Price = 8.99m, StockQuantity = 1000, WeightGrams = 65, BrandId = brands[1].Id, CategoryId = categories[7].Id, IsActive = true, CreatedAt = DateTime.UtcNow },
            new() { Name = "Plant Protein Isolate", Description = "100% plant-based protein, pea + rice blend", Price = 119.99m, StockQuantity = 175, WeightGrams = 1000, BrandId = brands[1].Id, CategoryId = categories[0].Id, IsActive = true, CreatedAt = DateTime.UtcNow },
            new() { Name = "N.O.-XPLODE Pre-Workout", Description = "Advanced pre-workout with beta-alanine and creatine", Price = 109.99m, StockQuantity = 220, WeightGrams = 555, BrandId = brands[3].Id, CategoryId = categories[2].Id, IsActive = true, CreatedAt = DateTime.UtcNow },
        };
        await db.Products.AddRangeAsync(products);
        await db.SaveChangesAsync();

        // Tag some products
        var productTags = new List<ProductTag>
        {
            new() { ProductId = products[0].Id, TagId = tags[4].Id },  // High-Protein
            new() { ProductId = products[0].Id, TagId = tags[6].Id },  // Bestseller
            new() { ProductId = products[1].Id, TagId = tags[4].Id },  // High-Protein
            new() { ProductId = products[1].Id, TagId = tags[5].Id },  // Low-Carb
            new() { ProductId = products[4].Id, TagId = tags[1].Id },  // Gluten-Free
            new() { ProductId = products[4].Id, TagId = tags[4].Id },  // High-Protein
            new() { ProductId = products[5].Id, TagId = tags[1].Id },  // Gluten-Free
            new() { ProductId = products[5].Id, TagId = tags[2].Id },  // Sugar-Free
            new() { ProductId = products[6].Id, TagId = tags[2].Id },  // Sugar-Free
            new() { ProductId = products[8].Id, TagId = tags[9].Id },  // Natural
            new() { ProductId = products[13].Id, TagId = tags[0].Id }, // Vegan
            new() { ProductId = products[13].Id, TagId = tags[3].Id }, // Lactose-Free
            new() { ProductId = products[13].Id, TagId = tags[4].Id }, // High-Protein
            new() { ProductId = products[12].Id, TagId = tags[4].Id }, // High-Protein
            new() { ProductId = products[12].Id, TagId = tags[5].Id }, // Low-Carb
        };
        await db.ProductTags.AddRangeAsync(productTags);
        await db.SaveChangesAsync();
    }
}
