using backend.Data.Interfaces;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly IUserService userRepository;
        public UsersController(IUserService userRepo)
        {
            userRepository = userRepo;
        }

        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            var users = await userRepository.GetUsers();

            // Will use a mapper in future
            var data = users.Select(u => new
            {
                u.Id,
                u.Username,
                u.Email,
                Role= u.Role.ToString(),
                u.CreatedOn
            });

            return Ok(new { status = true, data });
        }
    }
}
