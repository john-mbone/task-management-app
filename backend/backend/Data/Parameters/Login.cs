using System.ComponentModel.DataAnnotations;

namespace backend.Data.Parameters
{
    public class Login
    {
        [Required(ErrorMessage = "Username Is Required.")]
        public string Username { get; set; }

        [Required(ErrorMessage = "Password Is Required."), MinLength(4), DataType(DataType.Password)]
        public string Password { get; set; }

    }
}
