namespace SchoolManagementSystem.API.Models.Entities
{
    public class Parent
    {
        public int ParentId { get; set; }
        public string FullName { get; set; }
        public int StudentId { get; set; }
        public int TelephoneNumber { get; set; }
        public int UserId { get; set; }
    }
}
