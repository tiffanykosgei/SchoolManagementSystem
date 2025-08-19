using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SchoolManagementSystem.API.Data;
using SchoolManagementSystem.API.Models;
using SchoolManagementSystem.API.Models.Entities;
using SchoolManagementSystem.API.Models.DTOs;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;

namespace SchoolManagementSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager,
            ApplicationDbContext context,
            IConfiguration configuration)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("register-user")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> RegisterUser([FromBody] RegisterUserDto dto)
        {
            if (string.IsNullOrEmpty(dto.Role))
                return BadRequest("Role is required.");

            if (!await _roleManager.RoleExistsAsync(dto.Role))
                return BadRequest("Invalid role.");

            if (await _userManager.Users.AnyAsync(u => u.RegNo == dto.RegNo && !string.IsNullOrEmpty(dto.RegNo)))
                return BadRequest(new { code = "DuplicateRegNo", description = $"RegNo '{dto.RegNo}' is already in use." });

            if (await _userManager.FindByNameAsync(dto.Username) != null)
                return BadRequest(new { code = "DuplicateUserName", description = $"Username '{dto.Username}' is already taken." });

            if (await _userManager.FindByEmailAsync(dto.Email) != null)
                return BadRequest(new { code = "DuplicateEmail", description = $"Email '{dto.Email}' is already in use." });

            var user = new ApplicationUser
            {
                RegNo = dto.RegNo,
                UserName = dto.Username,
                Email = dto.Email,
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                PhoneNumber = dto.PhoneNumber,
                DateCreated = DateTime.UtcNow,
                MustChangePassword = true
            };

            var result = await _userManager.CreateAsync(user, dto.Password ?? "Temp@123!");

            if (!result.Succeeded)
                return BadRequest(result.Errors);

            await _userManager.AddToRoleAsync(user, dto.Role);

            return Ok(new
            {
                success = true,
                message = "User registered successfully.",
                RegNo = user.RegNo,
                UserId = user.Id
            });
        }

        [HttpGet("by-regno/{regNo}")]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> GetUserByRegNo(string regNo)
        {
            if (string.IsNullOrWhiteSpace(regNo))
                return BadRequest("RegNo is required.");

            var user = await _userManager.Users.FirstOrDefaultAsync(u => u.RegNo == regNo);
            if (user == null)
                return NotFound($"No user found with RegNo '{regNo}'.");

            // Fallback fix — if for any reason Username is still null
            if (string.IsNullOrWhiteSpace(user.UserName))
            {
                user.UserName = user.RegNo;
            }

            return Ok(new
            {
                ApplicationUserId = user.Id,
                RegNo = user.RegNo,
                Username = user.UserName,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                PhoneNumber = user.PhoneNumber
            });
        }

        [HttpGet("users")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _userManager.Users.ToListAsync();

            var result = new List<object>();
            foreach (var u in users)
            {
                var roles = await _userManager.GetRolesAsync(u);
                result.Add(new
                {
                    u.Id,
                    userName = u.UserName,
                    email = u.Email,
                    regNo = u.RegNo,
                    firstName = u.FirstName,
                    lastName = u.LastName,
                    phoneNumber = u.PhoneNumber,
                    roles
                });
            }

            return Ok(result);
        }

        [HttpPut("update-user/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateUser(string id, [FromBody] UpdateUserDto dto)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
                return NotFound("User not found.");

            user.FirstName = dto.FirstName ?? user.FirstName;
            user.LastName = dto.LastName ?? user.LastName;
            user.UserName = dto.Username ?? user.UserName;
            user.Email = dto.Email ?? user.Email;
            user.PhoneNumber = dto.PhoneNumber ?? user.PhoneNumber;

            var result = await _userManager.UpdateAsync(user);

            if (!result.Succeeded)
                return BadRequest(result.Errors);

            return Ok(new { message = "User updated successfully." });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var user = await _userManager.FindByNameAsync(dto.UserName);
            if (user == null) return Unauthorized("Invalid credentials");

            var checkPassword = await _userManager.CheckPasswordAsync(user, dto.Password);
            if (!checkPassword) return Unauthorized("Invalid credentials");

            if (user.MustChangePassword)
                return BadRequest("You must change your password on first login.");

            var roles = await _userManager.GetRolesAsync(user);

            var authClaims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            foreach (var role in roles)
            {
                authClaims.Add(new Claim(ClaimTypes.Role, role));
            }

            var authSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_configuration["JWT:Secret"]));

            var token = new JwtSecurityToken(
                issuer: _configuration["JWT:Issuer"],
                audience: _configuration["JWT:Audience"],
                expires: DateTime.Now.AddMinutes(Convert.ToDouble(_configuration["JWT:DurationInMinutes"])),
                claims: authClaims,
                signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
            );

            return Ok(new
            {
                token = new JwtSecurityTokenHandler().WriteToken(token),
                expiration = token.ValidTo
            });
        }

        [HttpPost("change-password-initial")]
        public async Task<IActionResult> ChangePasswordInitial([FromBody] ChangePasswordInitialDto dto)
        {
            var user = await _userManager.FindByNameAsync(dto.UserName);
            if (user == null) return Unauthorized();

            var result = await _userManager.ChangePasswordAsync(user, dto.CurrentPassword, dto.NewPassword);
            if (!result.Succeeded)
                return BadRequest(result.Errors);

            user.MustChangePassword = false;
            await _userManager.UpdateAsync(user);

            return Ok("Password changed successfully.");
        }

        [HttpPost("change-password")]
        [Authorize]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return Unauthorized();

            var result = await _userManager.ChangePasswordAsync(user, dto.CurrentPassword, dto.NewPassword);
            if (!result.Succeeded)
                return BadRequest(result.Errors);

            user.MustChangePassword = false;
            await _userManager.UpdateAsync(user);

            return Ok("Password changed successfully.");
        }
    }
}
