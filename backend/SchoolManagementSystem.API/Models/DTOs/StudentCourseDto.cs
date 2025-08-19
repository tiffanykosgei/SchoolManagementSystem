namespace SchoolManagementSystem.API.Models.DTOs
{
    public class StudentCourseDto
    {
        public int StudentId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string AdmissionNumber { get; set; }

        public int CourseId { get; set; }
        public string CourseName { get; set; }

        public DateTime EnrollmentDate { get; set; }
    }
}
