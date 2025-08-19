// File: Controllers/UserController.cs
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SchoolManagementSystem.API.Models;
using SchoolManagementSystem.API.Models.DTOs;
using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace SchoolManagementSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;

        public UserController(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager)
        {
            _userManager = userManager;
            _roleManager = roleManager;
        }

        // ✅ CREATE USER
        [Authorize(Roles = "Admin")]
        [HttpPost("create")]
        public async Task<IActionResult> CreateUser([FromBody] UserDto dto)
        {
            var user = new ApplicationUser
            {
                RegNo = dto.RegNo,               // ✅ Store RegNo
                Email = dto.Email,
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                UserName = dto.FirstName,        // ✅ Example: set UserName to FirstName
                DateCreated = DateTime.UtcNow,
                DoB = DateTime.UtcNow.AddYears(-18) // ⚠️ Placeholder
            };

            var result = await _userManager.CreateAsync(user, dto.Password);
            if (!result.Succeeded)
                return BadRequest(result.Errors);

            // Assign role if needed (e.g., default)
            return Ok($"User created.");
        }

        // ✅ UPDATE USER
        [Authorize(Roles = "Admin")]
        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateUser(string id, [FromBody] UserDto dto)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
                return NotFound("User not found");

            user.RegNo = dto.RegNo;            // ✅ Update RegNo if needed
            user.FirstName = dto.FirstName;
            user.LastName = dto.LastName;
            user.Email = dto.Email;
            user.UserName = dto.FirstName;     // ✅ Example: keep same

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
                return BadRequest(result.Errors);

            return Ok("User updated successfully");
        }

        // ✅ DELETE USER
        [Authorize(Roles = "Admin")]
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
                return NotFound("User not found");

            var result = await _userManager.DeleteAsync(user);
            if (!result.Succeeded)
                return BadRequest(result.Errors);

            return Ok("User deleted successfully");
        }

        // ✅ GET ALL USERS
        [HttpGet("all-users")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _userManager.Users.ToListAsync();
            var result = users.Select(u => new
            {
                u.Id,
                u.RegNo,               // ✅ Include RegNo
                u.UserName,
                u.Email
            });
            return Ok(result);
        }

        // ✅ GET USER BY REGISTRATION NUMBER
        [HttpGet("by-registration/{regNo}")]
        public async Task<IActionResult> GetUserByRegistration(string regNo)
        {
            var user = await _userManager.Users
                .Where(u => u.RegNo == regNo)
                .Select(u => new
                {
                    u.RegNo,
                    u.UserName,
                    u.FirstName,
                    u.LastName,
                    u.Email,
                    u.PhoneNumber
                })
                .FirstOrDefaultAsync();

            if (user == null) return NotFound();

            return Ok(user);
        }
    }
}
