using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Obfuscate.BL.Implementations;
using Obfuscate.BL.Interfaces;
using Obfuscate.Models.Entities;

namespace ObfuscateAPI.Controllers;
[Route("api/[controller]")]
[ApiController]
public class UserController : ControllerBase
{
    private readonly IUserService _userService;

    public UserController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpGet("GetUsers")]
    public async Task<IActionResult> Get() => Ok(await _userService.GetAllUsersAsync());

    [HttpPost("PostUser")]
    public async Task<IActionResult> Post([FromBody] Users user)
        => Ok(await _userService.CreateUserAsync(user));

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(string id, [FromBody] Users user)
        => Ok(await _userService.UpdateUserAsync(id, user));

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        await _userService.DeleteUserAsync(id);
        return NoContent();
    }
}
