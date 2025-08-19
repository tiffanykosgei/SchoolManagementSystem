using System.ComponentModel.DataAnnotations;
using AppUser = SchoolManagementSystem.API.Models.ApplicationUser;

namespace SchoolManagementSystem.API.Models.Entities
{
    public class Teacher
    {
        public int TeacherId { get; set; }
        [Required]
        public string RegNo { get; set; }
        public string EmployeeNumber { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public int CourseId { get; set; }
        public string PhoneNumber { get; set; }
        public string UserId { get; set; }
        public string Username { get; set; }
        public AppUser User { get; set; }
        public ICollection<CourseAssignment> CourseAssignments { get; set; }

    }
}
