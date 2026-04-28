using System.Net;
using System.Text.Json;
using FluentValidation;
using SolutionOrdersMobile.Application.Common.Exceptions;

namespace SolutionOrdersMobile.API.Middleware;

public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (NotFoundException ex)
        {
            await WriteResponse(context, HttpStatusCode.NotFound, ex.Message);
        }
        catch (ValidationException ex)
        {
            var errors = ex.Errors.Select(e => new { e.PropertyName, e.ErrorMessage });
            await WriteResponse(context, HttpStatusCode.BadRequest, "Validation failed.", errors);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unhandled exception");
            await WriteResponse(context, HttpStatusCode.InternalServerError, "An unexpected error occurred.");
        }
    }

    private static async Task WriteResponse(HttpContext context, HttpStatusCode statusCode, string message, object? errors = null)
    {
        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)statusCode;
        var body = JsonSerializer.Serialize(new { message, errors });
        await context.Response.WriteAsync(body);
    }
}
