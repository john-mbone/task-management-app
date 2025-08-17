using backend.Data.Interfaces;
using backend.Model;

using Microsoft.AspNetCore.Authentication;
using Microsoft.EntityFrameworkCore;

namespace backend.Data.Repositories
{
    public class UserRepository : IUserService
    {
        private readonly TaskDbContext _dbContext;
        public UserRepository(TaskDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task<User> CreateUser(User user)
        {
            await _dbContext.Users.AddAsync(user);
            await _dbContext.SaveChangesAsync();
            return user;
        }

        public async Task<bool> DeactivateUser(int Id)
        {
            var user = await _dbContext.Users.FindAsync(Id);

            if (user == null) return false;

            user.Active = false;

            await _dbContext.SaveChangesAsync();

            return true;
        }

        public async Task<User> GetUserById(int Id) => await _dbContext.Users.FirstAsync(p => p.Id == Id);

        public async Task<User> GetUserByUsername(string username) => await _dbContext.Users.FirstOrDefaultAsync(p => p.Username == username|| p.Email == username);


        public async Task<IEnumerable<User>> GetUsers() => await _dbContext.Users.ToListAsync();
        public Task<User> UpdateUser(User task)
        {
            throw new NotImplementedException();
        }

    }
}
