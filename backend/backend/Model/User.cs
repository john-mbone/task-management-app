using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace backend.Model
{
    public enum UserRole
    {
        USER,
        ADMIN
    }
    public class User : Base
    {
        [Required]
        public string Username { get; set; }
        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]

        // prevents the user passowrd from being shared
        [JsonIgnore]
        public string Password { get; set; }

        public bool Active { get; set; }

        [Required]
        public UserRole Role { get; set; } = UserRole.USER;

        public List<TaskItem>? TasksCreated { get; set; }

        public List<TaskItem>? TasksAssigned { get; set; }
    }
}
