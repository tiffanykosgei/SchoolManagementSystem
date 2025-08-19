using AppUser = SchoolManagementSystem.API.Models.ApplicationUser;

namespace SchoolManagementSystem.API.Models.Entities
{
    public class Admin
    {
        public int AdminId { get; set; }
        public string RegNo { get; set; }
        public string FullName { get; set; }
        public string Role { get; set; }

        public string UserId { get; set; }
        public AppUser User { get; set; } // 👈 Use alias
    }
}
