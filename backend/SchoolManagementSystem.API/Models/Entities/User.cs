namespace SchoolManagementSystem.API.Models.Entities
{
    public class User
    {
        public int UserId { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public string FullName { get; set; }
        public string Role { get; set; }
        public DateTime DoB { get; set; }
        public DateTime DateCreated { get; set; }
    }
}
