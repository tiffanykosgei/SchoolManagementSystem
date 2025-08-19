namespace SchoolManagementSystem.API.Models.DTOs
{
    public class UserDto
    {
        public string RegNo { get; set; }    // ✅ System-wide unique ID
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Role { get; set; }
    }
}
