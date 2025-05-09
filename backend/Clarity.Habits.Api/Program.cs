using Microsoft.EntityFrameworkCore;
using Clarity.Habits.Api.Data;
using Clarity.Habits.Api.Models;

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

app.MapGet("/habits", async (ClarityHabitsDbContext db) =>
{
    var habits = await db.Habits
        .OrderBy(h => h.SortOrder)
        .ToListAsync();

    return Results.Ok(habits);
});

app.MapPost("/habits", async (HabitCreateDto dto, ClarityHabitsDbContext db) =>
{
    var habit = new Habit
    {
        Id = Guid.NewGuid(),
        Name = dto.Name,
        GroupName = dto.GroupName,
        Frequency = dto.Frequency,
        SortOrder = dto.SortOrder,
        UserId = Guid.Empty // Placeholder until Auth is added
    };

    db.Habits.Add(habit);
    await db.SaveChangesAsync();

    return Results.Created($"/habits/{habit.Id}", habit);
});

app.MapPut("/habits/{id:guid}", async (
    Guid id,
    HabitUpdateDto dto,
    ClarityHabitsDbContext db) =>
{
    var habit = await db.Habits.FindAsync(id);

    if (habit is null)
        return Results.NotFound();

    habit.Name = dto.Name;
    habit.GroupName = dto.GroupName;
    habit.Frequency = dto.Frequency;
    habit.SortOrder = dto.SortOrder;
    habit.IsArchived = dto.IsArchived;

    await db.SaveChangesAsync();

    return Results.Ok(habit);
});

app.MapDelete("/habits/{id:guid}", async (Guid id, ClarityHabitsDbContext db) =>
{
    var habit = await db.Habits.FindAsync(id);

    if (habit is null)
        return Results.NotFound();

    db.Habits.Remove(habit);
    await db.SaveChangesAsync();

    return Results.NoContent(); // 204 No Content
});

app.Run();