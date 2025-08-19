namespace SchoolManagementSystem.API.Models.DTOs
{
    public class ReportEntryDto
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string CourseName { get; set; }
        public int Test1 { get; set; }
        public int Test2 { get; set; }
        public int FinalGrade { get; set; }
        public string Status { get; set; } // Optional: can be "Present", "Absent", etc.
        public DateTime EnrollmentDate { get; set; }
    }
}
