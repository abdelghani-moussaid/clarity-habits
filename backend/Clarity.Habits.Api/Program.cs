using Microsoft.EntityFrameworkCore;
using Clarity.Habits.Api.Data;
using Clarity.Habits.Api.Endpoints;

var builder = WebApplication.CreateBuilder(args);


// Register services
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Register DbContext
builder.Services.AddDbContext<ClarityHabitsDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();


if (!app.Environment.IsProduction())
{
    builder.WebHost.ConfigureKestrel(serverOptions =>
    {
        serverOptions.ConfigureHttpsDefaults(options =>
        {
            options.SslProtocols = System.Security.Authentication.SslProtocols.None;
        });
    });
}

// Configure middleware
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();

app.MapHabitEndpoints();

app.Run();