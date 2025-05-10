using Clarity.Habits.Api.Data;
using Clarity.Habits.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Clarity.Habits.Api.Endpoints;

public static class HabitEndpoints
{
    public static void MapHabitEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapGet("/habits", async (ClarityHabitsDbContext db) =>
        {
            var habits = await db.Habits.OrderBy(h => h.SortOrder).ToListAsync();
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
                UserId = Guid.Empty // Placeholder
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
            if (habit is null) return Results.NotFound();

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
            if (habit is null) return Results.NotFound();

            db.Habits.Remove(habit);
            await db.SaveChangesAsync();

            return Results.NoContent();
        });

        app.MapPost("/habits/{id:guid}/complete", async (Guid id, ClarityHabitsDbContext db) =>
        {
            var habit = await db.Habits.FindAsync(id);
            if (habit is null)
                return Results.NotFound();

            var today = DateOnly.FromDateTime(DateTime.UtcNow);

            // Prevent duplicate completion
            var alreadyCompleted = await db.HabitCompletions
                .AnyAsync(c => c.HabitId == id && c.CompletionDate == today);

            if (alreadyCompleted)
                return Results.BadRequest("Habit already completed for today.");

            var completion = new HabitCompletion
            {
                Id = Guid.NewGuid(),
                HabitId = id,
                CompletionDate = today
            };

            db.HabitCompletions.Add(completion);
            await db.SaveChangesAsync();

            return Results.Ok("Habit marked as complete for today.");
        });

        app.MapGet("/habits/{id:guid}/completions", async (Guid id, ClarityHabitsDbContext db) =>
        {
            var habitExists = await db.Habits.AnyAsync(h => h.Id == id);
            if (!habitExists)
                return Results.NotFound();

            var completions = await db.HabitCompletions
                .Where(c => c.HabitId == id)
                .OrderByDescending(c => c.CompletionDate)
                .ToListAsync();

            return Results.Ok(completions);
        });

        app.MapGet("/habits/today", async (ClarityHabitsDbContext db) =>
        {
            var today = DateOnly.FromDateTime(DateTime.UtcNow);

            var habitsWithToday = await db.Habits
                .Include(h => h.Completions.Where(c => c.CompletionDate == today))
                .ToListAsync();

            var grouped = habitsWithToday
                .GroupBy(h => h.GroupName ?? "Ungrouped")
                .ToDictionary(
                    g => g.Key,
                    g => g.Select(h => new
                    {
                        h.Id,
                        h.Name,
                        h.Frequency,
                        h.SortOrder,
                        h.IsArchived,
                        CompletedToday = h.Completions.Any()
                    })
                    .OrderBy(h => h.SortOrder)
                    .ToList()
                );

            return Results.Ok(grouped);
        });

        app.MapPut("/habits/{id:guid}/archive", async (Guid id, ClarityHabitsDbContext db) =>
        {
            var habit = await db.Habits.FindAsync(id);
            if (habit is null) return Results.NotFound();

            habit.IsArchived = true;
            await db.SaveChangesAsync();

            return Results.Ok();
        });
    }
}
