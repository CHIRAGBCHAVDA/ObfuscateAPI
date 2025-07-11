using Obfuscate.BL.Implementations;
using Obfuscate.BL.Interfaces;
using Obfuscate.DAL.Implementations;
using Obfuscate.DAL.Interfaces;
using ObfuscateAPI.Middlewares;

var builder = WebApplication.CreateBuilder(args);

var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";
builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenAnyIP(Int32.Parse(port));
});

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddHttpClient();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IUserService, UserService>();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(options => {
    options.AddPolicy("MyCORS",
        builder =>
        {
            builder.AllowAnyHeader()
            .AllowAnyMethod()
            .AllowAnyOrigin();
        });
});

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();


app.UseMiddleware<ObfuscationMiddleware>();
app.UseRouting();
//app.UseHttpsRedirection();
app.UseCors("MyCORS");
app.UseAuthorization();
app.MapControllers();

app.Run();
