using Microsoft.EntityFrameworkCore;
using SchoolManagementSystem.API.Models.Entities;

namespace SchoolManagementSystem.API.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }
        public DbSet<User> Users { get; set; }
        public DbSet<Student> Students { get; set; }
        public DbSet<Teacher> Teachers { get; set; }
        public DbSet<Course> Courses { get; set; }
        public DbSet<Admin> Admin { get; set; }
        public DbSet<Grade> Grades { get; set; }
         public DbSet<Attendance> Attendance { get; set; }
          public DbSet<Parent> Parents { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

        }
    }
}
