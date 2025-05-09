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

var app = builder.Build();

// Configure middleware
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapHabitEndpoints();

app.Run();