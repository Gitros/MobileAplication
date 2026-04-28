using FluentValidation;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using SolutionOrdersMobile.Application.Common.Behaviors;
using SolutionOrdersMobile.Application.Mappings;

namespace SolutionOrdersMobile.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddAutoMapper(cfg => cfg.AddMaps(typeof(MappingProfile).Assembly));

        services.AddValidatorsFromAssembly(typeof(DependencyInjection).Assembly);

        services.AddMediatR(cfg =>
            cfg.RegisterServicesFromAssembly(typeof(DependencyInjection).Assembly));

        services.AddTransient(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));

        return services;
    }
}
