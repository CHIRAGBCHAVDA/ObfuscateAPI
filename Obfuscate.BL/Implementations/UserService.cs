using Obfuscate.BL.Interfaces;
using Obfuscate.DAL.Implementations;
using Obfuscate.DAL.Interfaces;
using Obfuscate.Models.Entities;

namespace Obfuscate.BL.Implementations;
public class UserService : IUserService
{
    private readonly IUserRepository _repository;

    public UserService(IUserRepository repository)
    {
        _repository = repository;
    }

    public Task<IEnumerable<Users>> GetAllUsersAsync() => _repository.GetAllAsync();
    public Task<Users> CreateUserAsync(Users user) => _repository.CreateAsync(user);
    public Task<Users> UpdateUserAsync(string id, Users user) => _repository.UpdateAsync(id, user);
    public Task DeleteUserAsync(string id) => _repository.DeleteAsync(id);
}
