using backend.Model;

namespace backend.Data.Interfaces
{
    public interface IUserService
    {
        Task<IEnumerable<User>> GetUsers();

        Task<User> GetUserById(int Id);
        Task<User> GetUserByUsername(string username);  

        Task<User> CreateUser(User user);

        Task<User> UpdateUser(User user);

        Task<bool> DeactivateUser(int Id); 
    }
}
