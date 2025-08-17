using backend.Model;

using System.ComponentModel.DataAnnotations;

using TaskStatus = backend.Model.TaskStatus;

namespace backend.Data.Parameters
{
    public class TaskItem
    {
        [Required(ErrorMessage = "Please provide a title")]
        public string Title { get; set; } = string.Empty;

        [Required(ErrorMessage = "Please provide a description")]
        public string Description { get; set; } = string.Empty;
        public int Assignee { get; set; }

        public DateTime DueDate { get; set; } = DateTime.UtcNow;

    }

    public class TaskItemUpdate
    {
        public TaskStatus Status { get; set; }
    }
}
