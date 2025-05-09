using System.ComponentModel.DataAnnotations;

namespace Clarity.Habits.Api.Models
{
    public class Habit
    {
        public Guid Id { get; set; }

        [Required]
        public Guid UserId { get; set; }  // Placeholder — you'll link to Identity user later

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(50)]
        public string? GroupName { get; set; }  // e.g., Morning, Evening

        [Required]
        public string Frequency { get; set; } = "Daily";  // "Daily" or "Weekly"

        public bool IsArchived { get; set; } = false;

        public int SortOrder { get; set; } = 0;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<HabitCompletion> Completions { get; set; } = new List<HabitCompletion>();
    }
}