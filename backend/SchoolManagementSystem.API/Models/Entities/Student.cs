namespace SchoolManagementSystem.API.Models.Entities
{
    public class Student
    {
        public int StudentId { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public int TelephoneNumber { get; set; }
        public int CourseId { get; set; }
        public DateTime EnrollmentDate { get; set; }
        public int UserId { get; set; }
    }
}
