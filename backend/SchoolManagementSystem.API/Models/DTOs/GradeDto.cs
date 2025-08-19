namespace SchoolManagementSystem.API.Models.DTOs
{
    public class GradeDto
    {
        public int StudentId { get; set; }
        public int CourseId { get; set; }
        public int Test1 { get; set; }
        public int Test2 { get; set; }
        public int FinalGrade { get; set; }
        public DateTime DateRecorded { get; set; }
    }
}