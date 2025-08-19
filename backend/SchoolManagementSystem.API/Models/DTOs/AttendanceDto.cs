namespace SchoolManagementSystem.API.Models.DTOs
{
    public class AttendanceDto
    {
        public int StudentId { get; set; }
        public int CourseId { get; set; }
        public string Status { get; set; }
        public DateTime DateRecorded { get; set; }
    }
}