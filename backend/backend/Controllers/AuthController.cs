using backend.Data;
using backend.Data.Interfaces;
using backend.Data.Parameters;
using backend.Model;

using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IUserService userRepository;
        private readonly IAuthentication authenticationRepository;
        public AuthController(IUserService user, IAuthentication authentication)
        {
            userRepository = user;
            authenticationRepository = authentication;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] Register user)
        {
            var existingUser = await userRepository.GetUserByUsername(user.Username);

            if (existingUser != null)
            {
                return Conflict(new { status = false, message = "User already registered" });
            }

            var hashedPassword = authenticationRepository.GenerateHash(user.Password);

            var newUser = new User
            {
                Username = user.Username,
                Role = user.Role,
                Password = hashedPassword,
                Email = user.Email,
            };

            newUser = await userRepository.CreateUser(newUser);

            if (newUser != null)
            {
                return Ok(new
                {
                    status = true,
                    message = "User registered successfully"
                });
            }

            return new ObjectResult(new { status = false, messsage = "Unable to create user" });
        }


        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] Login login)
        {

            var existingUser = await userRepository.GetUserByUsername(login.Username);

            if (existingUser == null)
            {
                return Unauthorized(new { status = false, message = "Invalid username or password" });
            }


            if (!authenticationRepository.VerifyHash(login.Password, existingUser.Password))
            {
                return Unauthorized(new { status = false, message = "Invalid username or password" });
            }

            var token = authenticationRepository.GenerateToken(existingUser);

            var data = new
            {
                user = new
                {
                    username = existingUser.Username,
                    email = existingUser.Email,
                    role = existingUser.Role
                },
                token
            };

            return Ok(new
            {
                status = true,
                message = "Logged in successfully",
                data
            });
        }
    }
}
