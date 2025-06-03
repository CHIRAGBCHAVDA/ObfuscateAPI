using Obfuscate.Models.Entities;

namespace Obfuscate.BL.Interfaces;
public interface IUserService
{
    Task<IEnumerable<Users>> GetAllUsersAsync();
    Task<Users> CreateUserAsync(Users user);
    Task<Users> UpdateUserAsync(string id, Users user);
    Task DeleteUserAsync(string id);
}
