// Models/Entities/Message.cs
using System;

namespace SchoolManagementSystem.API.Models.Entities
{
    public class Message
    {
        public int MessageId { get; set; }
        public int ParentId { get; set; } // FK to ApplicationUser
        public string Content { get; set; }
        public DateTime SentAt { get; set; } = DateTime.UtcNow;
        public bool IsRead { get; set; } = false;
    }
}
