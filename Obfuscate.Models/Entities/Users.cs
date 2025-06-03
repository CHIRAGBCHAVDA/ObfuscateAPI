using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Obfuscate.Models.Entities;
public class Users
{
    public string? Id { get; set; }     // MockAPI generates this
    public string Name { get; set; }
    public string Email { get; set; }
    public int Age { get; set; }
}
