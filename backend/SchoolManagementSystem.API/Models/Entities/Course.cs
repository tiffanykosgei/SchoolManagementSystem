using System.Collections.Generic;

namespace SchoolManagementSystem.API.Models.Entities
{
    public class Course
    {
        public int CourseId { get; set; }
        public string CourseName { get; set; }
        public string CourseDescription { get; set; }
        public ICollection<StudentCourse> StudentCourses { get; set; }

        public ICollection<Grade> Grades { get; set; }
        public ICollection<Attendance> AttendanceRecords { get; set; }
        public ICollection<CourseAssignment> CourseAssignments { get; set; }
    }
}
