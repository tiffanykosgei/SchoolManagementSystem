namespace SchoolManagementSystem.API.Models.DTOs
{
    public class TeacherDto
    {
        public string RegNo { get; set; }  
        public string FirstName { get; set; }  
        public string LastName { get; set; }
        public string Username { get; set; }
        public string EmployeeNumber { get; set; }
        public string PhoneNumber { get; set; }
        public int CourseId { get; set; }  
        public string UserName { get; set; } 
         public string UserId { get; set; }
        public List<int> CourseIds { get; set; }
    }
}
