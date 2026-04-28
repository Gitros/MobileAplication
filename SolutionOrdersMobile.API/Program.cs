using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;
using SolutionOrdersMobile.API.Middleware;
using SolutionOrdersMobile.Application;
using SolutionOrdersMobile.Infrastructure;
using SolutionOrdersMobile.Infrastructure.Persistence;
using SolutionOrdersMobile.Infrastructure.Seeders;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddOpenApi();
builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});

var app = builder.Build();

// Apply migrations and seed on startup
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    await db.Database.MigrateAsync();
    await DatabaseSeeder.SeedAsync(db);
}

app.MapOpenApi();
app.MapScalarApiReference();

app.UseMiddleware<ExceptionHandlingMiddleware>();
app.UseCors("AllowAll");
app.UseAuthorization();
app.MapControllers();

app.Run();
