namespace SchoolManagementSystem.API.Models.Entities
{
    public class Attendance
    {
        public int AttendanceId { get; set; }
        public int StudentId { get; set; }
        public int CourseId { get; set; }
        public string Status { get; set; }
        public DateTime DateRecorded { get; set; }
    }
}
