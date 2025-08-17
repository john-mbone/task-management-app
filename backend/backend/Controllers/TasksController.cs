using backend.Data.Interfaces;
using backend.Data.Parameters;
using backend.Model;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using System.Security.Claims;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]

    //[Authorize(Roles = "ADMIN")]
    public class TasksController : ControllerBase
    {
        private readonly ITaskService taskService;
        private readonly IUserService userService;

        public TasksController(ITaskService tasks, IUserService user)
        {
            taskService = tasks;
            userService = user;
        }

        [HttpGet]
        public async Task<IActionResult> GetTasks(Model.TaskStatus? status, string? assignee)
        {
            var tasks = await taskService.GetTasks(status, assignee);


            var data = tasks.Select(t => new
            {
                t.Id,
                Status = t.Status.ToString(),
                Priority = t.Priority.ToString(),
                t.Title,
                t.DueDate,
                t.Description,
                t.CreatorId,
                t.CreatorUsername,
                t.AssigneeId,
                t.AssigneeUsername,
                t.CreatedOn,
                t.UpdatedOn
            });

            return Ok(new { status = true, data });
        }

        [HttpGet("statuses")]
        public IActionResult GetTaskStatuses()
        {
            var statuses = Enum.GetNames(typeof(Model.TaskStatus));
            return Ok(statuses);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTaskStatus(int id, [FromBody] TaskItemUpdate taskItem)
        {

            var task = await taskService.ChangeTaskStatus(id, taskItem.Status);
            if (task == null)
            {
                return BadRequest(new { status = false, message = "Something went wrong" });
            }
            return Ok(new { status = true,message="Status changed successuflly" });
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> CreateTask([FromBody] Data.Parameters.TaskItem task)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.Sid)?.Value;

            var assignee = await userService.GetUserById(task.Assignee);

            if (assignee == null) return UnprocessableEntity(new { message = "User not found" });

            var item = new Model.TaskItem
            {
                Title = task.Title,
                Description = task.Description,
                AssigneeId = task.Assignee,
                CreatorId = int.Parse(userIdClaim!),
                DueDate = task.DueDate
            };
            var newTask = await taskService.CreateTask(item);

            return Ok(new { status = true, message = "Task Created Successfully" });
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTask(int id)
        {
            try
            {
                var resp = await taskService.DeleteTask(id);

                return Ok(new { status = true, message = "Task Deleted Successfully" });
            }
            catch (Exception e)
            {
                return BadRequest(new { status = false, message = "Somthing went wrong" });
            }
        }
    }
}
