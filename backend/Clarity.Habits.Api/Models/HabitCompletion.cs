namespace Clarity.Habits.Api.Models
{
    public class HabitCompletion
    {
        public Guid Id { get; set; }

        public Guid HabitId { get; set; }

        public DateOnly CompletionDate { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public Habit Habit { get; set; } = null!;
    }
}
