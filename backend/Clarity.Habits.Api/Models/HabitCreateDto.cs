using System.ComponentModel.DataAnnotations;

namespace Clarity.Habits.Api.Models
{
    public class HabitCreateDto
    {
        [Required]
        public string Name { get; set; } = string.Empty;

        public string? GroupName { get; set; }  // e.g., Morning

        [Required]
        public string Frequency { get; set; } = "Daily";  // or Weekly

        public int SortOrder { get; set; } = 0;
    }
}
