using System.ComponentModel.DataAnnotations;

namespace backend.Model
{

    public enum TaskPriority
    {
        Low,
        Medium,
        High
    }

    public enum TaskStatus
    {
        TODO,
        IN_PROGRESS,
        DONE
    }

    public class TaskItem: Base
    {
        public string Title { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        [Required]
        public TaskPriority Priority { get; set; } = TaskPriority.Low;

        [Required]
        public TaskStatus Status { get; set; } = TaskStatus.TODO;

        public bool IsDeleted { get; set; } = false;
        public int? AssigneeId { get; set; }
        public virtual User Assignee { get; set; }

        public int CreatorId { get; set; }
        public virtual User? Creator { get; set; }
         
        public DateTime DueDate { get; set; }

    }
}
