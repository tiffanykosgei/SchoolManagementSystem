using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using AppUser = SchoolManagementSystem.API.Models.ApplicationUser;

namespace SchoolManagementSystem.API.Models.Entities
{
    public class Parent
    {
       [Required]
       public string RegNo { get; set; }

        public int ParentId { get; set; }

        // FK to Identity
        public string UserId { get; set; }
        public AppUser User { get; set; }

        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string PhoneNumber { get; set; }
         public string Email { get; set; }

        // Relationships
        public ICollection<Student> Students { get; set; }
    }
}
