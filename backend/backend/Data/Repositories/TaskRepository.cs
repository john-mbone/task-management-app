using backend.Data.Interfaces;
using backend.Model;

using Microsoft.EntityFrameworkCore;

using TaskStatus = backend.Model.TaskStatus;

namespace backend.Data.Repositories
{

    public class TaskDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public TaskPriority Priority { get; set; }
        public TaskStatus Status { get; set; }
        public int? AssigneeId { get; set; }
        public string? AssigneeUsername { get; set; }
        public int CreatorId { get; set; }
        public string CreatorUsername { get; set; }
        public DateTime DueDate { get; set; }
        public DateTime CreatedOn { get; set; }
        public DateTime UpdatedOn { get; set; }
    }

    public class TaskRepository : ITaskService
    {
        private readonly TaskDbContext taskContext;

        public TaskRepository(TaskDbContext taskContext)
        {
            this.taskContext = taskContext;
        }
        public async Task<TaskItem?> AssignTask(int taskId, int assigneeId)
        {
            var task = await taskContext.Tasks.FirstOrDefaultAsync(t => t.Id == taskId);
            if (task == null)
                return null;

            task.AssigneeId = assigneeId;

            task.UpdatedOn = DateTime.UtcNow;

            await taskContext.SaveChangesAsync();
            return task;
        }


        public async Task<TaskItem?> ChangeTaskStatus(int taskId, Model.TaskStatus status)
        {
            var task = await taskContext.Tasks.FirstOrDefaultAsync(t => t.Id == taskId);

            if (task == null) return null;

            task.Status = status;
            task.UpdatedOn = DateTime.UtcNow;

            await taskContext.SaveChangesAsync();

            return task;
        }


        public async Task<TaskItem> CreateTask(TaskItem task)
        {
            await taskContext.Tasks.AddAsync(task);
            await taskContext.SaveChangesAsync();
            return task;
        }

        public async Task<bool> DeleteTask(int id)
        {
            var task = await taskContext.Tasks.FindAsync(id);

            if (task == null) return false;

            task.IsDeleted = true;

            await taskContext.SaveChangesAsync();

            return true;
        }

        public async Task<TaskDto?> GetTaskById(int id)
        {
            var task = await taskContext.Tasks
                .Include(t => t.Creator)
                .Include(t => t.Assignee)
                .Where(t => t.Id == id && !t.IsDeleted)
                .Select(t => new TaskDto
                {
                    Id = t.Id,
                    Title = t.Title,
                    Description = t.Description,
                    Priority = t.Priority,
                    Status = t.Status,
                    AssigneeId = t.AssigneeId,
                    AssigneeUsername = t.Assignee != null ? t.Assignee.Username : null,
                    CreatorId = t.CreatorId,
                    CreatorUsername = t.Creator != null ? t.Creator.Username : string.Empty,
                    DueDate = t.DueDate,
                    CreatedOn = t.CreatedOn,
                    UpdatedOn = t.UpdatedOn
                })
                .FirstOrDefaultAsync();

            return task;
        }


        public async Task<IEnumerable<TaskDto>> GetTasks(Model.TaskStatus? status, string? assignee)
        {
            var query = taskContext.Tasks.AsQueryable();

            if (status != null)
            {
                // Is an ENUM
                query = query.Where(t => t.Status == status.Value);
            }

            if (!string.IsNullOrEmpty(assignee))
            {
                if (int.TryParse(assignee, out var assigneeId))
                {
                    query = query.Where(t => t.AssigneeId == assigneeId);
                }
            }

            var tasks = await query
                .Where(t => !t.IsDeleted)
                .Include(t => t.Creator)
                .Include(t => t.Assignee)
                .Select(t => new TaskDto
                {
                    Id = t.Id,
                    Title = t.Title,
                    Description = t.Description,
                    Priority = t.Priority,
                    Status = t.Status,
                    AssigneeId = t.AssigneeId,
                    AssigneeUsername = t.Assignee != null ? t.Assignee.Username : null,
                    CreatorId = t.CreatorId,
                    CreatorUsername = t.Creator != null ? t.Creator.Username : string.Empty,
                    DueDate = t.DueDate,
                    CreatedOn = t.CreatedOn,
                    UpdatedOn = t.UpdatedOn
                })
                .ToListAsync();


            return tasks;
        }


        public async Task<TaskItem?> UpdateTask(int id, TaskItem task)
        {
            var oldTask = await taskContext.Tasks.FindAsync(id);

            if (oldTask != null)
            {
                oldTask.Title = task.Title;
                oldTask.Description = task.Description;
                oldTask.Status = task.Status;
                oldTask.Priority = task.Priority;
                oldTask.DueDate = task.DueDate;

                await taskContext.SaveChangesAsync();
            }

            return null;
        }


    }
}
