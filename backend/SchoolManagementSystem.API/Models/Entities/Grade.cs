namespace SchoolManagementSystem.API.Models.Entities
{
    public class Grade
    {
        public int GradeId { get; set; }
        public int StudentId { get; set; }
        public int CourseId { get; set; }
        public int GradeAwarded { get; set; }
        public DateTime DateRecorded { get; set; }
    }
}
