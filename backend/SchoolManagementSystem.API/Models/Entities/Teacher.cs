namespace SchoolManagementSystem.API.Models.Entities
{
    public class Teacher
    {
        public int TeacherId { get; set; }
        public string FullName { get; set; }
        public int CourseId { get; set; }
        public int TelephoneNumber { get; set; }
        public int UserId { get; set; }
    }
}
