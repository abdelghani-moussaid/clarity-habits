using Clarity.Habits.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Clarity.Habits.Api.Data
{
    public class ClarityHabitsDbContext(DbContextOptions<ClarityHabitsDbContext> options) : DbContext(options)
    {
        public DbSet<Habit> Habits => Set<Habit>();
        public DbSet<HabitCompletion> HabitCompletions => Set<HabitCompletion>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<HabitCompletion>()
                .HasIndex(c => new { c.HabitId, c.CompletionDate })
                .IsUnique();

            modelBuilder.Entity<Habit>()
                .HasMany(h => h.Completions)
                .WithOne(c => c.Habit)
                .HasForeignKey(c => c.HabitId);
        }
    }
}
