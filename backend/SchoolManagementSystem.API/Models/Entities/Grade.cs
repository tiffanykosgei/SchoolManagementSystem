namespace SchoolManagementSystem.API.Models.Entities
{
    public class Grade
    {
        public int GradeId { get; set; }
        public int StudentId { get; set; }
        public int CourseId { get; set; }
        public int Term { get; set; }
        public Student Student { get; set; }
        public Course Course { get; set; }
        public int Test1 { get; set; }  
        public int Test2 { get; set; } 
        public int FinalGrade { get; set; }


        public DateTime DateRecorded { get; set; } 
        public DateTime EnrollmentDate { get; set; }

        public bool IsFinalGrade { get; set; }
    }
}
