using System.ComponentModel.DataAnnotations;

namespace Clarity.Habits.Api.Models
{
    public class HabitUpdateDto
    {
        [Required]
        public string Name { get; set; } = string.Empty;

        public string? GroupName { get; set; }

        [Required]
        public string Frequency { get; set; } = "Daily";

        public int SortOrder { get; set; } = 0;

        public bool IsArchived { get; set; } = false;
    }
}
