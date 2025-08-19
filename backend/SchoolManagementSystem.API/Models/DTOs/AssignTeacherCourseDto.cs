using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace SchoolManagementSystem.API.Models.DTOs
{
    public class AssignTeacherCourseDto
    {
        [Required]
        public int TeacherId { get; set; }

        [Required]
        [MinLength(1, ErrorMessage = "At least one course must be assigned.")]
        public List<int> CourseIds { get; set; }
    }
}
