using Obfuscate.Models.Entities;

namespace Obfuscate.DAL.Interfaces;
public interface IUserRepository
{
    Task<IEnumerable<Users>> GetAllAsync();
    Task<Users> CreateAsync(Users user);
    Task<Users> UpdateAsync(string id, Users user);
    Task DeleteAsync(string id);

}
