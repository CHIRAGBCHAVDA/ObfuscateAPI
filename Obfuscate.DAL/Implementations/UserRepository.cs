using Obfuscate.DAL.Interfaces;
using Obfuscate.Models.Entities;
using System.Net.Http.Json;

namespace Obfuscate.DAL.Implementations;
public class UserRepository : IUserRepository
{
    private readonly HttpClient _httpClient;
    private const string BaseUrl = "https://68374246664e72d28e442023.mockapi.io/users/Users";

    public UserRepository(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<IEnumerable<Users>> GetAllAsync()
    {
        var res = await _httpClient.GetFromJsonAsync<IEnumerable<Users>>(BaseUrl);
        return res!;
    }

    public async Task<Users> CreateAsync(Users user)
    {
        var res = await _httpClient.PostAsJsonAsync(BaseUrl, user);
        return await res.Content.ReadFromJsonAsync<Users>();
    }

    public async Task<Users> UpdateAsync(string id, Users user)
    {
        var res = await _httpClient.PutAsJsonAsync($"{BaseUrl}/{id}", user);
        return await res.Content.ReadFromJsonAsync<Users>();
    }

    public async Task DeleteAsync(string id)
    {
        await _httpClient.DeleteAsync($"{BaseUrl}/{id}");
    }
}
