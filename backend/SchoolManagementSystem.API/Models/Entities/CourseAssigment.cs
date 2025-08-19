namespace SchoolManagementSystem.API.Models.Entities
{

public class CourseAssignment
{
    public int CourseAssignmentId { get; set; }

    public int CourseId { get; set; }
    public Course Course { get; set; }

    public int TeacherId { get; set; }
    public Teacher Teacher { get; set; }
}
}