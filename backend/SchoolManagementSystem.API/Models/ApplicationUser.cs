using Microsoft.AspNetCore.Identity;
using SchoolManagementSystem.API.Models.Entities;
using System;
using System.ComponentModel.DataAnnotations; 

namespace SchoolManagementSystem.API.Models
{
    public class ApplicationUser : IdentityUser
    {
        [Required] // ✅ Mark RegNo required
        public string RegNo { get; set; }  // ✅ System-wide unique ID

        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime? DoB { get; set; }
        public DateTime DateCreated { get; set; } = DateTime.UtcNow;

        public bool MustChangePassword { get; set; } = true;

        // Navigation properties
        public Student Student { get; set; }
        public Parent Parent { get; set; }
        public Teacher Teacher { get; set; }
        public Admin Admin { get; set; }
    }
}
