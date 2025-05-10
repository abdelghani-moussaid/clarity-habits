using Microsoft.EntityFrameworkCore;
using Clarity.Habits.Api.Data;
using Clarity.Habits.Api.Endpoints;

var builder = WebApplication.CreateBuilder(args);


// Register services
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

if (builder.Environment.IsProduction())
{
    builder.WebHost.ConfigureKestrel(options =>
    {
        options.ListenAnyIP(int.Parse(Environment.GetEnvironmentVariable("PORT") ?? "8080" );
    });
}

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


// Configure middleware
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();

app.MapHabitEndpoints();

app.Run();