namespace SchoolManagementSystem.API.Models.DTOs
{
    public class ReportFilterDto
    {
        public string? FullName { get; set; }
        public string? CourseName { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
    }
}