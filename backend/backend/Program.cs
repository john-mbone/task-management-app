using backend.Data;
using backend.Data.Interfaces;
using backend.Data.Repositories;
using backend.Data.Seeders;

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

using System.Text;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers().AddJsonOptions(options =>
{
    // Serialize ENUM
    // Allow statuses to be posted as ether int or str
    options.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter());
}); 


// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen();

// Here I am setting up an InMemory DB on DI

// I have installed Microsoft.EntityFrameworkCore.InMemory for prod we would need to use a real db Microsoft.EntityFrameworkCore.SqlServer

builder.Services.AddDbContext<TaskDbContext>(opt => opt.UseInMemoryDatabase("TaskInMemoryDb"));

// For live db
//builder.Services.AddDbContext<TaskDbContext>(options =>
//    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"))
//);


var config = builder.Configuration.GetSection("Jwt");

var JWTKey = Encoding.UTF8.GetBytes(config["Key"]!);
 
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(jwt =>
    {

        jwt.SaveToken = true;

        jwt.RequireHttpsMetadata = false;

        jwt.TokenValidationParameters = new TokenValidationParameters
        {
            IssuerSigningKey = new SymmetricSecurityKey(JWTKey),
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = config["Issuer"],
            ValidAudience = config["Audience"]
        };
    });

builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy",
        policy => policy
            .AllowAnyOrigin()   
            .AllowAnyMethod()  
            .AllowAnyHeader()); 
});



builder.Services.AddAuthorization();


// DI for the main services
builder.Services.AddTransient<ITaskService, TaskRepository>();
builder.Services.AddTransient<IUserService, UserRepository>();
builder.Services.AddSingleton<IAuthentication, Authentication>();

var app = builder.Build();

// SEED 

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;

    await DBInitializer.Initialize(services);
}


// Registering the policy I created
app.UseCors("CorsPolicy");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();


