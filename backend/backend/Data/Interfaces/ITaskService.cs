using backend.Data.Repositories;
using backend.Model;

namespace backend.Data.Interfaces
{
    public interface ITaskService
    {
        Task<IEnumerable<TaskDto>> GetTasks(Model.TaskStatus? status, string? assignee);

        Task<TaskDto?> GetTaskById(int Id);

        Task<TaskItem> CreateTask(TaskItem task);

        Task<TaskItem?> UpdateTask(int id, TaskItem task);

        Task<bool> DeleteTask(int id);

        Task<TaskItem?> AssignTask(int taskId, int assigneeId);

        Task<TaskItem?> ChangeTaskStatus(int taskId, Model.TaskStatus status);
    }
}
