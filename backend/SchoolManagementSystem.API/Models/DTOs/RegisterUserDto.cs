using System.ComponentModel.DataAnnotations;
namespace SchoolManagementSystem.API.Models.DTOs
{
    public class RegisterUserDto
    {
        [Required]
        public string Username { get; set; }

        [Required]
        public string RegNo { get; set; }

        [Required]
        public string Email { get; set; }

        public string FirstName { get; set; }
        public string LastName { get; set; }

        public string PhoneNumber { get; set; }
        public string Password { get; set; }

        [Required]
        public string Role { get; set; }
    }
}