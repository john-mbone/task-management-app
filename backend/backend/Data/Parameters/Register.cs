using backend.Model;

using System.ComponentModel.DataAnnotations;

namespace backend.Data.Parameters
{
    public class Register
    {
        [Required(ErrorMessage = "Username Is Required.")]
        public string Username { get; set; }

        [Required(ErrorMessage = "Password Is Required.")]
        public string Password { get; set; }

        [Required(ErrorMessage ="A valid email is required"),DataType(DataType.EmailAddress)]
        public string Email { get; set; }

        [Required(ErrorMessage = "Role is required")]
        [EnumDataType(typeof(UserRole), ErrorMessage = "Invalid role value")]
        public UserRole Role { get; set; } = UserRole.USER;
    }
}
