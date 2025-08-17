using backend.Data.Interfaces;
using backend.Model;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;


namespace backend.Data.Repositories
{
    public class Authentication : IAuthentication
    {

        private readonly IConfiguration _config;
        public Authentication(IConfiguration config)
        {
            _config = config;
        }
        public string GenerateHash(string Password)
        {
            return BCrypt.Net.BCrypt.HashPassword(Password);
        }

        public string GenerateToken(User claim)
        {
            var tokenHandler = new JwtSecurityTokenHandler();

            var Jwt = _config.GetSection("Jwt");

            var KEY = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Jwt["Key"]!));

            var creds = new SigningCredentials(KEY, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
            {
                new(ClaimTypes.Sid, claim.Id.ToString()),
                new(ClaimTypes.Name, claim.Username),
                new(ClaimTypes.Email, claim.Email),
                new(ClaimTypes.Role, claim.Role.ToString())
            };

            var securityToken = new JwtSecurityToken(
                issuer: Jwt["Issuer"],
                audience: Jwt["Audience"],
                claims: claims,
                notBefore: DateTime.UtcNow,
                expires: DateTime.UtcNow.AddMinutes(int.TryParse(Jwt["ExpiresMinutes"], out int mins) ? mins : 90),
                signingCredentials: creds
            );

            return tokenHandler.WriteToken(securityToken);
        }

        public bool VerifyHash(string Password, string Hash)
        {
            return BCrypt.Net.BCrypt.Verify(Password, Hash);
        }
    }
}
