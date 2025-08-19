using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using AppUser = SchoolManagementSystem.API.Models.ApplicationUser;

namespace SchoolManagementSystem.API.Models.Entities
{
    public class Student
    {
        public int StudentId { get; set; }
       [Required]
        public string RegNo { get; set; }


        // FK to Identity
        public string UserId { get; set; }
        [Required]
        public string Username { get; set; }
        public AppUser User { get; set; }

        public string AdmissionNumber { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string PhoneNumber { get; set; }
        [Required]
        public string Email { get; set; }              
        public DateTime DoB { get; set; }
        public DateTime EnrollmentDate { get; set; }

        // FK to Parent
        public int ParentId { get; set; }
        public Parent Parent { get; set; }

        // Relationships
        public ICollection<StudentCourse> StudentCourses { get; set; }
        public ICollection<Grade> Grades { get; set; }
        public ICollection<Attendance> Attendance { get; set; }
    }
}
