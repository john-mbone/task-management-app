using backend.Model;

namespace backend.Data.Interfaces
{
    public interface IAuthentication
    {
        string GenerateHash(string Password);
        bool VerifyHash(string Password, string Hash);
        string GenerateToken(User claims);

    }
}
