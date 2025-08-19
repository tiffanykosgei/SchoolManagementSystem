namespace SchoolManagementSystem.API.Models.DTOs
{
    public class ChangePasswordInitialDto
    {
        public string UserName { get; set; }
        public string CurrentPassword { get; set; }
        public string NewPassword { get; set; }
    }
}