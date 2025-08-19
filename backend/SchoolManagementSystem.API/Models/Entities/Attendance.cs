namespace SchoolManagementSystem.API.Models.Entities
{
    public class Attendance
    {
        public int AttendanceId { get; set; }
        public int StudentId { get; set; }
        public Student Student { get; set; } 
        public int CourseId { get; set; }
        public Course Course { get; set; }

        public string Status { get; set; } 
        public DateTime DateRecorded { get; set; } 
    }
}
