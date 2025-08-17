using backend.Data.Interfaces;
using backend.Model;

using System.Diagnostics;

namespace backend.Data.Seeders
{
    public class DBInitializer
    {
        public static async Task Initialize(IServiceProvider provider)
        {
            try
            {
                var context = provider.GetRequiredService<TaskDbContext>();

                var authService = provider.GetRequiredService<IAuthentication>();

                var users = new List<User>
                {
                    new User
                    {
                        Id = 1,
                        Active = true,
                        Email = "user@example.com",
                        Password = authService.GenerateHash("123456"),
                        Username = "James Mwangi",
                        Role = UserRole.USER
                    },
                    new User
                    {
                        Id = 2,
                        Active = true,
                        Email = "admin@example.com",
                        Password = authService.GenerateHash("123456"),
                        Username = "Joe Kamau",
                        Role = UserRole.ADMIN
                    },
                    new User
                    {
                        Id = 3,
                        Active = true,
                        Email = "staff@example.com",
                        Password = authService.GenerateHash("123456"),
                        Username = "Staff Example",
                        Role = UserRole.ADMIN
                    }
                };


                await context.Users.AddRangeAsync(users);

                var tasks = new List<TaskItem>
                {
                    new TaskItem
                    {
                        AssigneeId = 1,
                        CreatorId = 2,
                        Title = "Assessment",
                        DueDate = DateTime.Now.AddDays(5),
                        Description = "Develop a .NET Core API without any support and submit by midday.",
                        Priority = TaskPriority.High,
                        Status = Model.TaskStatus.TODO
                    },
                    new TaskItem
                    {
                        AssigneeId = 2,
                        CreatorId = 1,
                        Title = "Frontend Setup",
                        DueDate = DateTime.Now.AddDays(3),
                        Description = "Initialize React project with Material UI and configure routing.",
                        Priority = TaskPriority.Medium,
                        Status = Model.TaskStatus.IN_PROGRESS
                    },
                    new TaskItem
                    {
                        AssigneeId = 3,
                        CreatorId = 1,
                        Title = "Database Design",
                        DueDate = DateTime.Now.AddDays(7),
                        Description = "Design PostgreSQL schema for users, tasks, and roles.",
                        Priority = TaskPriority.High,
                        Status = Model.TaskStatus.TODO
                    },
                    new TaskItem
                    {
                        AssigneeId = 1,
                        CreatorId = 3,
                        Title = "Testing Suite",
                        DueDate = DateTime.Now.AddDays(10),
                        Description = "Implement unit tests for service layer and mock repositories.",
                        Priority = TaskPriority.Low,
                        Status = Model.TaskStatus.DONE
                    },
                    new TaskItem
                    {
                        AssigneeId = 2,
                        CreatorId = 3,
                        Title = "Authentication",
                        DueDate = DateTime.Now.AddDays(2),
                        Description = "Implement JWT-based authentication with refresh tokens.",
                        Priority = TaskPriority.High,
                        Status = Model.TaskStatus.IN_PROGRESS
                    },
                    new TaskItem
                    {
                        AssigneeId = 3,
                        CreatorId = 2,
                        Title = "Deployment",
                        DueDate = DateTime.Now.AddDays(14),
                        Description = "Prepare Dockerfile and GitHub Actions workflow for CI/CD pipeline.",
                        Priority = TaskPriority.Medium,
                        Status = Model.TaskStatus.TODO
                    }
                };

                await context.Tasks.AddRangeAsync(tasks);

                await context.SaveChangesAsync();
            }
            catch (Exception e)
            {
                Debug.WriteLine($"An error occured while seeding: {e.Message}");
            }
        }
    }
}
