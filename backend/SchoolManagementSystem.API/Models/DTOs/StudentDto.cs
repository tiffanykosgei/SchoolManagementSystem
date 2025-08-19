using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace SchoolManagementSystem.API.Models.DTOs
{
    public class StudentDto
    {
        [Required]
        public string RegNo { get; set; }              
        public string AdmissionNumber { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        [Required]
        public string Username { get; set; }  
        [Required]         
        public string Email { get; set; }              
        public string PhoneNumber { get; set; }
        public DateTime DoB { get; set; }
        public DateTime EnrollmentDate { get; set; }
        public string UserId { get; set; }             
        public int ParentId { get; set; }              
        public List<int> CourseIds { get; set; } = new List<int>();
    }
}
