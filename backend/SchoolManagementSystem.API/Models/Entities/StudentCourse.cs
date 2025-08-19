using System;

namespace SchoolManagementSystem.API.Models.Entities
{
    public class StudentCourse
    {
        public int StudentId { get; set; }
        public Student Student { get; set; }

        public int CourseId { get; set; }
        public Course Course { get; set; }

        public DateTime EnrollementDate { get; set; } = DateTime.UtcNow;
    }
}
